'use client'

import { useRouter } from "next/navigation";

export default function Index() {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col justify-center items-center">
      Home!!
      <button className="font-bold" onClick={()=>router.push('/profile')}>profile</button>
    </div>
  );
}
