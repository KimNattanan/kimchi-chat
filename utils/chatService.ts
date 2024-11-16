'use server'

import { createClient } from "@/utils/supabase/server";

export async function sendMsg(prevState: any, formData:FormData){
  const room = formData.get('room')?.toString();
  const userId = formData.get('userId')?.toString();
  const msg = formData.get('msg')?.toString();
  if(!msg||!userId||!room) return {msg:'did not send'};

  console.log(formData);

  const supabase = await createClient();
  const { data, error } = await supabase.from('messages')
                                        .insert([{
                                          room: room,
                                          userId: userId,
                                          message: msg
                                        }]);
  if(error){
    console.log("error:",error);
    return {msg:'error'}
  }

  return {msg:'sent'};
}