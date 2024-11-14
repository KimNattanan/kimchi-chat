"use server";

import { SignJWT, importJWK } from "jose";
import { cookies } from 'next/headers'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

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
  const account=data[0];

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