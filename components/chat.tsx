'use client'

import { useState, useEffect, useRef, MutableRefObject, RefObject } from "react";
import { sendMsg } from "@/utils/chatService"
import { useFormState } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import { getAccountFromUserId, getStorageFile } from "@/app/actions";


export function MessageBox(
  {userId, message}:
  {userId: string, message: string}){
    
    const [userDisplay,setUserDisplay] = useState('');
    const [img,setImg] = useState('/corgi.png');
    
    const effectAsync=async()=>{
      const fullacc=await getAccountFromUserId(userId);
      setUserDisplay(fullacc.display_name);
      const imgPath = await getStorageFile('profiles',fullacc.imgPath);
      if(imgPath) setImg(imgPath);
    }
    useEffect(()=>{
      effectAsync();
    },[])
    
    return(
      <div className='flex mx-16 my-16 cursor-default'>
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


const batchSize = 5;

export function ChatBox({room,userId}:{room:string,userId:string}){
  const [msgs,setMsgs]=useState<any[]>([]);
  const [sendState,sendAction]=useFormState(sendMsg,{msg:''});
  const [loadRange,setLoadRange]=useState({l:-1,r:-1});

  const handleMessageInsert=(payload:any)=>{
    if(payload.room==room){
      setMsgs((prev)=>[
        {
          userId: payload.userId,
          message: payload.message
        },
        ...prev
      ]);
    }
  }

  const loadMoreMessage = async()=>{
    setLoadRange((prev)=>({l:prev.l-batchSize, r:prev.r-batchSize}));
  }
  useEffect(()=>{
    const play=async()=>{
      let l=loadRange.l;
      let r=loadRange.r;
      if(l<0) l=0;
      if(l>r) return;
      const supabase=createClient();
      const {data,error} = await supabase.from('messages').select('*',{count:'exact'}).like('room',room).range(l,r);
      if(error){
        console.log('error:',error);
        return;
      }
      let arr=[];
      for(let i=data.length-1;i>=0;--i){
        if(!data[i]) continue;
        arr.push({
          userId: data[i].userId,
          message: data[i].message
        });
      }
      if(arr.length==0) return;
      setMsgs((prev)=>[
        ...prev,
        ...arr
      ]);
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

  return(
    <div className="relative flex flex-col w-full h-full bg-indigo-800 bg-opacity-10">
      
      <div className="flex-1 relative overflow-y-auto scrollbar-xs">
        {
          msgs.map((v:any,i:number)=>{
            return (
              <div
                key={i}
                className={` relative transition-transform duration-1000`}
              >
                <MessageBox userId={v.userId} message={v.message}/>
              </div>
            )
          })
        }
        <button
          className={`bg-cyan-500 bg-opacity-40 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] p-2 font-bold border-y-2 border-white text-white w-full mb-4
                      ${loadRange.l>0?'':'hidden'}`}
          onClick={loadMoreMessage}
        >Load More</button>
      </div>
      <form action={sendAction} className="flex h-7">
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