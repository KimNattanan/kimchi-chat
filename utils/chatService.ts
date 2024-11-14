'use server'

export async function sendMsg(prevState: any, formData:FormData){
  const userId = formData.get('userId')?.toString();
  const msg = formData.get('msg')?.toString();
  if(!msg) return {msg:'did not send'};

  

  return {msg:'sent'};
}