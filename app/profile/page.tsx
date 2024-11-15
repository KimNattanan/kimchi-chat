'use client'

import { Router } from "lucide-react";
import { updProfile, readAccountCookie, getAccountFromUserId, getStorageFile } from "../actions"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Index() {

  const router = useRouter();
  const [curName,setCurName] = useState('');
  const [curImg,setCurImg] = useState('/cat.jpg');
  const [hideSave,setHideSave] = useState(false);

  const previewImage = (input: React.ChangeEvent<HTMLInputElement>)=>{
    if(input.target.files && input.target.files[0]){
      let reader = new FileReader();
      reader.onload = function(e){
        if(typeof(e.target?.result)=='string') setCurImg(e.target?.result);
      }
      reader.readAsDataURL(input.target.files[0]);
    }
  }

  const initCurName = async()=>{
    try{
      const account = await readAccountCookie();
      const info = await getAccountFromUserId(account.userId);
      const img = await getStorageFile('profiles',info.imgPath);
      setCurName(info.display_name);
      if(img) setCurImg(img);

    }catch(e){
      console.log('error:',e);
    }
  }
  useEffect(()=>{
    initCurName();
  },[]);

  return (
    <>
      <div className="flex flex-col justify-center min-h-dvh items-center">
        <button
          className="bg-slate-500 px-4 font-bold my-2 rounded-full text-xs text-white"
          name="btn"
          value={'home'}
          onClick={()=>router.push('/home')}
        >Home</button>
        <form
          action={updProfile}
          className="flex flex-col justify-center items-center"
        >
          <img src={curImg} className="rounded-full aspect-square w-60 bg-white object-cover"/>
          <label htmlFor="file"
            className="font-bold bg-opacity-50 bg-emerald-400 px-4 my-2 rounded-full hover:cursor-pointer"
          >{`> UPLOAD <`}</label>
          <input
            className="hidden"
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={previewImage}
          />
          <label htmlFor="display_name">Display Name:</label>
          <input
            className="bg-transparent border-b-2 border-black text-center placeholder:text-rose-700"
            type="text"
            id="display_name"
            name="display_name"
            placeholder={curName}
          />
          <button
            className={`font-bold ${hideSave?'hidden':''}`}
            name='btn'
            value={'save'}
            onClick={()=>setHideSave(true)}
          >save</button>
        </form>
      </div>
    </>
  );
}
