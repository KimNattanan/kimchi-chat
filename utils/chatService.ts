'use client'

import { createClient } from "@/utils/supabase/client";

export async function sendMsg(formData:FormData){
  const room = formData.get('room')?.toString();
  const userId = formData.get('userId')?.toString();
  const msg = formData.get('msg')?.toString();
  if(!msg||!userId||!room) return;

  const supabase = createClient();
  const { data, error } = await supabase.from('messages')
                                        .insert([{
                                          room: room,
                                          userId: userId,
                                          message: msg
                                        }]);
  if(error){
    console.log("error:",error);
    return;
  }
}