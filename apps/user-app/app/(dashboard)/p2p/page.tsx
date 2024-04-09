import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { P2pTxn } from "../../../components/P2pTxn";
interface Transaction {
    timestamp: Date;
    amount: number;
    toUserId: number;
    fromUserId:number
}
async function getP2pTxn(){
    const sessions=await getServerSession(authOptions);
    const userId = Number(sessions?.user.id); 
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId }, 
                { toUserId: userId }    
            ]
        }
    });
    return txns.map((t:Transaction)=>({
        time:t.timestamp,
        amount:t.amount,
        to:t.toUserId,
        from:t.fromUserId
    }))
    
}
export default async function() {
    const transactions=await getP2pTxn();
    return <div className="w-screen">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">

        <SendCard />
        <P2pTxn  transactions={transactions} />
        </div>
    </div>
}