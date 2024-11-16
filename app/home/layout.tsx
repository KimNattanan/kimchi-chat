'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccountFromUserId, getStorageFile, readAccountCookie } from "../actions";

export default function RootLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const [profileClicked, setProfileClicked] = useState(false);
  const [userId, setUserId] = useState('');
  const [userDisplay, setUserDisplay] = useState('');
  const [userImg, setUserImg] = useState('/corgi.png');
  const [rndQuote, setRndQuote] = useState('。。。');

  const effectAsync=async()=>{
    const acc = await readAccountCookie();
    setUserId(acc.userId);
    const fullAcc = await getAccountFromUserId(acc.userId);
    setUserDisplay(fullAcc.display_name);
    const img = await getStorageFile('profiles',fullAcc.imgPath);
    if(img) setUserImg(img);

    try {
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
      setRndQuote(data.content);
    } catch (err) {
      setRndQuote(':(');
    }
  }

  useEffect(()=>{
    effectAsync();
    
  },[]);

  return (
    <div className="flex flex-col h-dvh w-screen">
      <div className="h-12 w-screen bg-cyan-500 bg-opacity-80 border-b-2 border-green-900 fixed z-50">
        <div className="flex flex-row absolute h-full max-w-[50%] sm:max-w-[70%] overflow-scroll scrollbar-xs pt-2">
          <div className="font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] ml-8">
            {rndQuote}
          </div>
        </div>
        <div className="flex flex-row-reverse absolute right-0 h-full max-w-[50%] sm:max-w-[30%] items-center overflow-hidden">
          <img src={userImg}
            className={`h-full aspect-square rounded-full object-cover mx-4
                        drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] transition-all 
                        ${profileClicked?'opacity-0 rotate-180 hover:cursor-default':'hover:cursor-pointer'}`}
            onClick={()=>{
              setProfileClicked(true);
              router.push('profile');
            }}
          />
          <div className="font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">{userDisplay+" (@"+userId+")"}</div>
        </div>
      </div>
      <div className="flex mt-12 flex-grow overflow-hidden justify-center">
        {children}
      </div>
    </div>
  );
}
