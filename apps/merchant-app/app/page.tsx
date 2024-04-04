import {getServerSession} from "next-auth";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { authOptions } from "./lib/auth";

//testing CD

export default async function Page() {
  const session=await getServerSession(authOptions);
  if(session?.user){
    redirect('/landing')
  }else{
    redirect('/api/auth/signin')
    
  }
}
