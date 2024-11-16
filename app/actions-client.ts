"use client";

import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { readAccountCookie } from "./actions";

export async function getAccountFromUserId(userId: string){
  const supabase = createClient();
  const {data, error} = await supabase.from('accounts')
                                      .select('*')
                                      .like('userId',userId);
  if(error){
    console.log(error);
    return {};
  }
  if(data.length==0) return {};
  return data[0];
}
export async function getStorageFile(bucket: string, fname: string){
  const supabase = createClient();

  const { data:dt1, error } = await supabase.storage.from(bucket)
                                                    .list();
  if (error) {
    console.error(error)
    return null
  }

  const imgs = dt1.filter(item => item.name === fname)
  if(imgs.length==0) return null;

  const { data } = supabase.storage.from(bucket)
                                   .getPublicUrl(fname);
  return data.publicUrl;
}

export async function updProfile(formData: FormData) {
  const submitType = formData.get('btn');
  if(submitType!='save') return;

  const account0 = await readAccountCookie();
  if(!account0) return;
  const supabase = createClient();

  const display_name = formData.get('display_name')?.toString();
  if(display_name?.length!=0){
    const {data, error} = await supabase.from('accounts')
                                        .update({display_name: display_name})
                                        .eq('id',account0.id).select();
    if(error){
      console.log(error);
      return;
    }
  }

  let img=formData.get('file');
  if(img && (img as File).size){
    img=img as File;
    const { data:dt1, error:e1 } = await supabase.from('accounts')
                                                 .select('*')
                                                 .like('userId',account0.userId);
    if(e1){
      console.log(e1,'e1');
      return;
    }
    if(dt1.length==0) return;
    let img0 = dt1[0].imgPath;
    if(img0) supabase.storage.from('profiles').remove(img0);
    const {data:dt2, error:e2} = await supabase.storage.from('profiles')
                                                       .upload(account0.id+"_"+img.name,img);
    if(e2){
      console.log(e2,'e2');
      return;
    }
    const {data:dt3, error:e3} = await supabase.from('accounts')
                                               .update({imgPath: account0.id+"_"+img.name})
                                               .eq('id',account0.id);
    if(e3){
      console.log(e3,'e3');
      return;
    }
  }

  return redirect('/profile');
}