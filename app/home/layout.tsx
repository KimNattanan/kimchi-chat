'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readAccountCookie } from "@/app/actions";
import { getAccountFromUserId, getStorageFile } from "@/app/actions-client";
import MenuBar from "@/components/menuBar";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col h-dvh w-screen">
      <MenuBar/>
      <div className="flex mt-12 flex-grow overflow-hidden justify-center">
        {children}
      </div>
    </div>
  );
}
