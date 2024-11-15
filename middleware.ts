import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { jwtVerify, importJWK } from "jose";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  try{
    const accountToken = request.cookies.get('accountToken')?.value;
    if(!accountToken) return NextResponse.redirect(new URL('/',request.url));
    const secretJWK = {
      kty: 'oct',
      k: process.env.JOSE_SECRET
    }
    const secretKey = await importJWK(secretJWK, 'HS256');
    const { payload } = await jwtVerify(accountToken, secretKey);

    const supabase = await createClient();
    const { data, error } = await supabase.from('accounts')
                                          .select('*')
                                          .like('userId',(payload.account as any).userId)
                                          .like('password',(payload.account as any).password);
    if(error){
      console.log(error);
      return NextResponse.redirect(new URL('/',request.url));
    }
    if(data.length==0) return NextResponse.redirect(new URL('/',request.url));

    return NextResponse.next();
  }catch(e){
    return NextResponse.redirect(new URL('/',request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/home",
    "/profile",
  ],
};
