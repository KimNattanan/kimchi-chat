'use client'

import { ChatBox } from "@/components/chat";
import { use, useEffect, useState } from "react";
import { readAccountCookie } from "@/app/actions";

export default function Index({ params }:{ params:any }) {
  const _params = use(params) as any;
  const [userId, setUserId] = useState('');
  const [ready, setReady] = useState(false);

  const effectAsync = async()=>{
    const acc = await readAccountCookie();
    setUserId(acc.userId);
  }
  useEffect(()=>{
    effectAsync();
    setReady(true);
  },[])
  return (
    <>
      <img src="/fujisan.jpg" className="fixed w-full h-full object-cover opacity-40 select-none"
        style={{zIndex: -1}}
      />
      <div className="flex flex-col justify-center items-center h-full w-full lg:w-1/2">
        {ready && <ChatBox room={_params.room} userId={userId}/>}
      </div>
    </>
  );
}
