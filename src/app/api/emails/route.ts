import Email from '@/emails/EmailTemp';

import { Resend } from 'resend';



const resend = new Resend('re_RKhRtMph_BSenJiXscVS2dbjvnccdfx13');
export async function POST(){
   
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'bewithme2407@gmail.com',
    subject: 'hello world',
    react: Email() ,
  });
  return Response.json({ "data" :"msg" })
  
} 