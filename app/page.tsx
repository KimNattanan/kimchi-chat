'use client'

import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Index() {
  const router=useRouter();

  return (
    <div className="flex h-screen bg-amber-100 justify-center items-center">
      <button
        className="bg-white text-sky-700 font-bold h-fit w-fit p-4 m-2 shadow-xl rounded-tl-3xl active:bg-transparent transition-colors"
        onClick={()=>router.push('/sign-in')}
      >
        Sign-in
      </button>
      <button
        className="bg-white text-rose-600 font-bold h-fit w-fit p-4 m-2 shadow-xl rounded-br-3xl active:bg-transparent transition-colors"
        onClick={()=>router.push('/sign-up')}
      >
        Sign-up
      </button>
    </div>
  );
}
