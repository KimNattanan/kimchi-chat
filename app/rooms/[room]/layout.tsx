'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readAccountCookie } from "@/app/actions";
import { getAccountFromUserId, getStorageFile } from "@/app/actions-client";
import MenuBar from "@/components/menuBar";

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
      <MenuBar/>
      <div className="flex mt-12 flex-grow overflow-hidden justify-center">
        {children}
      </div>
    </div>
  );
}
