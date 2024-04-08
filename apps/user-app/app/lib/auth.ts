import db from "@repo/db/client";
import CredentialsProvider, { CredentialInput} from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { TokenSet,Session } from "next-auth";

interface AuthCredentials extends Record<string, CredentialInput> {
  phone: CredentialInput,
  password: CredentialInput
}

interface AuthUser {
  id: string,
  name: string,
  number: string
}
interface CustomSession extends Session {
     user: {
    id: string;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
  }

export const authOptions = {
  providers: [
    CredentialsProvider<AuthCredentials>({
      name: 'Credentials',
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "+91 9087654321" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if(!credentials) return null;
        const {phone,password}=credentials;
        if(!phone||!password) return null;
        
        // Do zod validation, OTP validation here
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            number: phone
          }
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(password, existingUser.password);
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              number: existingUser.number
            } as AuthUser;
          }
          return null;
        }

        try {
          const user = await db.user.create({
            data: {
              number: phone,
              password: hashedPassword
            }
          });
          
          return {
            id: user.id.toString(),
            name: user.name,
            number: user.number
          } as AuthUser;
        } catch(e) {
          console.error(e);
        }

        return null
      },
    })
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: { token: TokenSet, session: Record<string, any> }) {
      session.user.id = token.sub
      if (session?.user) {
        session.user.id = token.sub;
      }

      return session as CustomSession
    }
  }
}
