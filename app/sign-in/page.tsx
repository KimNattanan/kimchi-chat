'use client'

import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState  } from "react";
import { useFormState } from "react-dom";
import { signInAction } from "../actions";

export default function Index() {
  const router=useRouter();
  const [submitState,submitAction] = useFormState(signInAction,{message:'',error:''});

  return (
    <div className="flex h-screen flex-col bg-amber-100 justify-center items-center">
      <div className="w-min">
        <div className="w-full relative h-6">
          <button
            className="bg-slate-500 absolute ml-5 right-0 px-4 my-1 rounded-full text-xs text-white"
            onClick={()=>router.push('/')}
          >
            Back
          </button>
        </div>
        <form action={submitAction} className="py-10 px-10 border-y-2 border-green-800">
          <div className="flex font-bold my-2 w-96">
            <label htmlFor="userId">UserId:</label>
            <input
              className="ml-4 flex-1 font-normal"
              type="text"
              name="userId"
              id="userId"
            />
          </div>
          <div className="flex font-bold my-2 w-96">
            <label htmlFor="password">Password:</label>
            <input
              className="ml-4 flex-1 font-normal"
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
            className="bg-cyan-600 rounded-xl text-white px-4 py-1 my-2 font-bold w-full"
          >
            Sign-in
          </button>
        </form>
      </div>
    </div>
  );
}
