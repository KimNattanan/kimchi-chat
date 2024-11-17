'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readAccountCookie } from "@/app/actions";
import { getAccountFromUserId, getStorageFile } from "@/app/actions-client";

export default function MenuBar() {
  const router = useRouter();
  const [profileClicked, setProfileClicked] = useState(false);
  const [userId, setUserId] = useState('');
  const [userDisplay, setUserDisplay] = useState('');
  const [userImg, setUserImg] = useState('/corgi.png');

  const searchRoom=(formData: FormData)=>{
    const room = formData.get('searchInput')?.toString();
    if(!room) return;
    if(room=='home') router.push('/home');
    else router.push('/rooms/'+room);
  }
  
  useEffect(()=>{
    const play=async()=>{
      const acc = await readAccountCookie();
      setUserId(acc.userId);
      const fullAcc = await getAccountFromUserId(acc.userId);
      setUserDisplay(fullAcc.display_name);
      const img = await getStorageFile('profiles',fullAcc.imgPath);
      if(img) setUserImg(img);
    };
    play();
  },[]);

  return(
    <div className="h-12 w-screen bg-cyan-500 bg-opacity-80 border-b-2 border-green-900 fixed z-50">
      <form
        action={searchRoom}
        className="flex flex-row absolute h-full max-w-[50%] sm:max-w-[70%] overflow-hidden py-2 pl-4 items-center font-bold text-white w-full"
      >
        <label htmlFor="searchInput" className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] h-full">
          <img
            className="object-cover h-full"
            src="/searchIcon.png"
          />
        </label>
        <input
          className='ml-2 pl-4 min-w-0
                     w-0 opacity-0 focus:opacity-100 hover:opacity-100 focus:flex-1 hover:flex-1 transition-all
                     font-light cursor-default bg-gray-600 rounded-full bg-opacity-20 focus:outline-none text-white text-opacity-100 placeholder:text-white placeholder:text-opacity-80
                    '
          type="text"
          id="searchInput"
          name="searchInput"
          placeholder="search room..."
        />
      </form>
      <div className="flex flex-row-reverse absolute right-0 h-full max-w-[50%] sm:max-w-[30%] items-center overflow-hidden">
        <img src={userImg}
          className={`h-full aspect-square rounded-full object-cover mx-4
                      drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] transition-all 
                      ${profileClicked?'opacity-0 rotate-180 hover:cursor-default':'hover:cursor-pointer'}`}
          onClick={()=>{
            setProfileClicked(true);
            router.push('/profile');
          }}
        />
        <div className="font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">{userDisplay+" (@"+userId+")"}</div>
      </div>
    </div>
  );
}