'use client'

import { useState, useActionState, useEffect, useRef } from "react";
import { sendMsg } from "@/utils/chatService"

export function MessageBox({userId, msg,className='',ref=null}: any){
  return(
    <div className={className} ref={ref}>
      <div className='flex mx-16 my-16 cursor-default'>
        <div className="rounded-full mr-5 w-10 h-10 bg-emerald-200 select-none"></div>
        <div className="max-w-[calc(100%-4rem)]">
          <div className="font-bold text-cyan-50 drop-shadow-glow selection:bg-slate-50 selection:text-red-950 break-words">Kimura Kinpachi ﾉｼ</div>
          <div
            className="bg-slate-200 bg-opacity-30 text-black skew-x-2 selection:bg-cyan-400 selection:bg-opacity-40 selection:text-slate-50
                      px-3 py-1 break-words drop-shadow-glow w-fit max-w-full whitespace-pre-wrap"
          >
            {msg}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatBox(){
  const userId=99;
  const [msgs,setMsgs]=useState([{userId:0,msg:"yo!yo!\n\n\n\n!yo!yo!yo!yo!yo!yo!yo!yo!yo!"},{userId:0,msg:"msg1"},{userId:0,msg:"msg2"},{userId:0,msg:"msg3"}]);
  const [msgPos,setMsgPos]=useState([0,0,0,0]);
  const [msgRef,setMsgRef]=useState([useRef(null),useRef(null),useRef(null),useRef(null)]);
  const [sendState,sendAction]=useActionState(sendMsg,{msg:''});

  useEffect(()=>{
    // let sum=0;
    // let pos=[];
    // pos.length=msgs.length;
    // pos[0]='0';
    // for(let i=1;i<msgs.length;++i){
    //   sum+=msgRef[i-1].current.offsetHeight;
    //   pos[i]='calc('+sum+'px - '+(i<<2)+'rem)';
    // }
    // setMsgPos(pos);
  },[msgs]);

  return(
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 relative overflow-y-auto">
        {
          msgs.map((v,i)=>{
            return (
              <div key={i} className={` relative transition-transform duration-1000`}
                style={{
                  top: `${msgPos[i]}px`,
                  transform: `translateY(${msgPos[i]})`
                }}
              >
                <MessageBox ref={msgRef[i]} className="absolute w-full" userId={v.userId} msg={v.msg}/>
              </div>
            )
          })
        }
      </div>
      <form action={sendAction} className="flex h-7">
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
          className="text-black flex-1 pl-8 focus:outline-none cursor-default bg-cyan-50 bg-opacity-30 focus:bg-opacity-60 drop-shadow-glow selection:bg-cyan-400 selection:bg-opacity-50"
        />
        <button
          className="text-white font-bold bg-black bg-opacity-60 w-32 select-none cursor-default text-xl focus:outline-none drop-shadow-glow active:bg-white active:text-black"
        >❘＞</button>
      </form>
    </div>
  );
}