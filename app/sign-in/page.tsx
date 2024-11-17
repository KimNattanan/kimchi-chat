'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState  } from "react";
import { readAccountCookie, signInAction } from "@/app/actions";
import { useFormState } from "react-dom";
import { NavBtn } from "@/components/buttons";
import { createClient } from "@/utils/supabase/client";

export default function Index() {
  const router=useRouter();
  const [submitState,submitAction] = useFormState(signInAction,{message:'',error:''});
  const [submitted, setSubmitted] = useState(false);

  

  return (
    <div className="flex h-dvh justify-center items-center">
      <div className={`w-screen mw412:w-min`}>
        <div className="w-screen relative h-6 mw412:w-full">
          <NavBtn
            text="Back"
            className="bg-slate-500 absolute right-0 px-4 my-1 rounded-full text-xs text-white transition-opacity"
            defClass=""
            clickClass="opacity-0 hover:cursor-default"
            path="/"
          />
        </div>
        <form action={(formData)=>{
          submitAction(formData);
          setSubmitted(false);
        }} className="p-10 border-y-2 border-green-800">
          <div className="flex font-bold my-2">
            <label htmlFor="userId">UserId:</label>
            <input
              className="ml-4 flex-1 font-normal min-w-0"
              type="text"
              name="userId"
              id="userId"
            />
          </div>
          <div className="flex font-bold my-2">
            <label htmlFor="password">Password:</label>
            <input
              className="ml-4 flex-1 font-normal min-w-0"
              type="password"
              name="password"
              id="password"
            />
          </div>
          <div className="text-xs text-red-600 font-bold">
            {submitState.error}
          </div>
          <div className="text-xs text-green-700 font-bold">
            {submitState.message}
          </div>
          <button
            className={`bg-cyan-600 rounded-xl text-white px-4 py-1 my-2 font-bold w-full ${submitted?'opacity-50 hover:cursor-default':''}`}
            onClick={()=>setSubmitted(true)}
          >
            Sign-in
          </button>
        </form>
      </div>
    </div>
  );
}
