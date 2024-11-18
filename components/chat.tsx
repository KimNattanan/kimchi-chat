'use client'

import { useState, useEffect, useRef, MutableRefObject, RefObject } from "react";
import { createClient } from "@/utils/supabase/client";
import { getAccountFromUserId, getStorageFile } from "@/app/actions-client";


export function MessageBox(
  {userDisplay, img, message}:
  {userDisplay: string, img: string, message: string}){
  
  const [animIn, setAnimIn] = useState(false);
  
  useEffect(()=>{
    setAnimIn(true);
  },[]);

  return(
    <div className={`flex mx-16 my-16 cursor-default transition-transform ${animIn?'':'-translate-x-96'}`}>
      <img
        className="rounded-full mr-5 w-10 h-10 select-none object-cover drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]"
        src={img}
      />
      <div className="max-w-[calc(100%-4rem)]">
        <div className="font-bold text-cyan-50 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]  break-words">{userDisplay}</div>
        <div
          className="bg-white bg-opacity-60 text-black skew-x-2
          px-3 py-1 break-words w-fit max-w-full whitespace-pre-wrap"
          >
          {message}
        </div>
      </div>
    </div>
  );
}


const batchSize = 20;
const defProfile = '/corgi.png';

export function ChatBox({room,userId}:{room:string,userId:string}){
  const [msgs,setMsgs]=useState<any[]>([]);
  const [loadRange,setLoadRange]=useState({l:-1,r:-1});
  const [showLoadMore,setShowLoadMore]=useState(false);

  
  const loadMoreMessage = async()=>{
    setLoadRange((prev)=>({l:prev.l-batchSize, r:prev.r-batchSize}));
  }
  useEffect(()=>{
    const play=async()=>{
      setShowLoadMore(false);
      let l=loadRange.l;
      let r=loadRange.r;
      if(l<0) l=0;
      if(l>r) return setShowLoadMore(true);
      const supabase=createClient();
      const {data,error} = await supabase.from('messages').select('*',{count:'exact'}).like('room',room).range(l,r).order('id',{ ascending: true });
      if(error){
        console.log('error:',error);
        return setShowLoadMore(true);
      }
      for(let i=data.length-1;i>=0;--i){
        if(!data[i]) continue;
        const fullacc=await getAccountFromUserId(data[i].userId);
        const img=await getStorageFile('profiles',fullacc.imgPath);
        setMsgs((prev)=>[
          ...prev,
          {
            userDisplay: fullacc.display_name,
            img: img||defProfile,
            message: data[i].message,
            id: data[i].id
          }
        ]);
      }
      setShowLoadMore(true);
    }
    play();
  },[loadRange]);

  const effectAsync=async()=>{
    const supabase=createClient();
    const {data,error} = await supabase.from('messages').select('*').like('room',room);
    if(error){
      console.log('error:',error);
      return;
    }
    let n=data.length;
    setLoadRange({l:n-batchSize,r:n-1});
  }
  
  const handleMessageInsert=async(payload:any)=>{
    if(payload.room==room){
      const fullacc=await getAccountFromUserId(payload.userId);
      const img=await getStorageFile('profiles',fullacc.imgPath);
      setMsgs((prev)=>[
        {
          userDisplay: fullacc.display_name,
          img: img||defProfile,
          message: payload.message,
          id: payload.id
        },
        ...prev
      ]);
    }
  }

  useEffect(()=>{
    effectAsync();
    const supabase = createClient();
    const channel = supabase.channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
                              },
                              (payload)=>handleMessageInsert(payload.new)
                            ).subscribe();

    return ()=>{
      supabase.removeChannel(channel);
    }
  },[]);

  const sendMsg=async(formData:FormData)=>{
    const room = formData.get('room')?.toString();
    const userId = formData.get('userId')?.toString();
    const msg = formData.get('msg')?.toString();
    if(!msg||!userId||!room) return;

    const supabase = createClient();
    const { data, error } = await supabase.from('messages')
                                          .insert([{
                                            room: room,
                                            userId: userId,
                                            message: msg
                                          }]);
    if(error){
      console.log("error:",error);
      return;
    }
  }

  return(
    <div className="relative flex flex-col w-full h-full bg-indigo-800 bg-opacity-10">
      
      <div className="flex-1 relative overflow-y-auto scrollbar-xs flex flex-col-reverse">
        {
          msgs.map((v:any,i:number)=>{
            return (
              <div
                key={v.id}
                className={` relative transition-transform duration-1000`}
              >
                <MessageBox userDisplay={v.userDisplay} img={v.img} message={v.message}/>
              </div>
            )
          })
        }
        <button
          className={`bg-cyan-500 bg-opacity-40 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] p-2 font-bold border-y-2 border-white text-white w-full mb-4
                      ${(loadRange.l>0&&showLoadMore)?'':'hidden'}`}
          onClick={loadMoreMessage}
        >Load More</button>
        <div
          className={`flex bg-rose-500 bg-opacity-40 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] p-2 font-bold border-y-2 border-white text-white w-full mb-4 justify-center
                      ${showLoadMore?'hidden':''}`}
        >Loading...</div>
      </div>
      <form action={sendMsg} className={`flex h-7 ${showLoadMore?'':''}`}>
        <input
          type="text"
          name="room"
          className="hidden"
          value={room}
          readOnly
        />
        <input
          type="text"
          name="userId"
          className="hidden"
          value={userId}
          readOnly
        />
        <input
          type="text"
          name="msg"
          placeholder="Say something...?"
          className="text-black flex-1 pl-8 focus:outline-none cursor-default bg-cyan-50 bg-opacity-30 focus:bg-opacity-60 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] placeholder:text-white selection:bg-cyan-400 selection:bg-opacity-50"
        />
        <button
          className="text-white font-bold bg-black bg-opacity-60 w-32 select-none cursor-default text-xl focus:outline-none drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] active:bg-white active:text-black"
        >❘＞</button>
      </form>
    </div>
  );
}
