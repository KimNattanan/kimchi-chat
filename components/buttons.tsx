'use client'

import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";

export function NavBtn(
  { text='', className='', defClass='', clickClass='', path='' }:
  { text: string, className: string, defClass: string, clickClass: string, path: string }){
  const [clicked, setClicked] = useState(false);
  const router = useRouter();
  return(
    <button className={`${className} ${clicked?clickClass:defClass}`}
      onClick={()=>{
        setClicked(true);
        router.push(path);
      }}
    >{text}</button>
  );
}