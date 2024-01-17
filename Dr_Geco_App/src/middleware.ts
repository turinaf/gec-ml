import * as jose from 'jose';
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
export interface UserRequest extends NextRequest {
    token: any
}

export async function middleware(req: UserRequest) {
    const token = req.cookies.get('token');
    
    try {
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" });
      } else {
        const decode = await jose.jwtVerify(
          token.value,
          new TextEncoder().encode(process.env.JWT_SECRET_TOKEN as string)
        );
          if (decode) {
          return NextResponse.next();
        } else {
          return NextResponse.json({ error: "Unauthorized" });
        }
      }
    } catch (error:any) {
      if (error.code === "ERR_JWT_EXPIRED") {
          // Handle token expiration specifically
        return NextResponse.json({ error: "Token expired" });
      } else {
          // Handle other errors
          console.log(error)
        return NextResponse.json({ error: "Unauthorized" });
      }
    }
}
export const config = {
    matcher: ['/api/user']
};
 
