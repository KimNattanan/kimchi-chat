"use server";

import { SignJWT, importJWK, jwtVerify } from "jose";
import { cookies } from 'next/headers'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signUpAction(prevState:any, formData: FormData){
  const userId = formData.get("userId")?.toString();
  const password = formData.get("password")?.toString();

  if(!userId||!password){
    return {message:'',error: 'UserId and password are required!'}
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('accounts').select('*').like('userId',userId);
  if(error){
    console.log(error.code,error.message);
    return {message:'',error: error.message};
  }
  if(data.length) return {message:'',error: 'UserId is already taken!'};

  {
    const { data, error } = await supabase.from('accounts').insert([
      {
        display_name: 'unnamed',
        userId: userId,
        password: password,
      }
    ]);
    if(error){
      console.log(error.code,error.message);
      return {message:'',error:error.message};
    }
  }

  return {message:'Done, please try signing-in!',error:''};
}


export async function signInAction(prevState:any, formData: FormData){
  const userId = formData.get("userId")?.toString();
  const password = formData.get("password")?.toString();

  if(!userId||!password){
    return {message:'',error: 'UserId and password are required!'}
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('accounts').select('*').like('userId',userId).like('password',password);
  if(error){
    console.log(error.code,error.message);
    return {message:'',error: error.message};
  }
  if(data.length==0) return {message:'',error: 'Incorrect!'};
  const account={
    id: data[0].id,
    userId: data[0].userId,
    password: data[0].password
  };

  const secretJWK={
    kty: 'oct',
    k: process.env.JOSE_SECRET
  };
  const secretKey = await importJWK(secretJWK, 'HS256');
  const token = await new SignJWT({ account })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('4w')
                .sign(secretKey);
  (await cookies()).set('accountToken', token);

  return redirect("/home");
}

export async function readAccountCookie(){
  const accountToken=(await cookies()).get('accountToken')?.value;
  if(!accountToken) return null;
  const secretJWK = {
    kty: 'oct',
    k: process.env.JOSE_SECRET
  }
  const secretKey = await importJWK(secretJWK, 'HS256');
  const { payload } = await jwtVerify(accountToken, secretKey)
  return payload.account as any;
}
export async function getAccountFromUserId(userId: string){
  const supabase = await createClient();
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
  const supabase = await createClient();

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
  const supabase = await createClient();

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
