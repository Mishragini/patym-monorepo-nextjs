"use client"
import { Card } from "@repo/ui/card"

import { useSession } from "next-auth/react"

export const P2pTxn = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        to: number,
        from: number
    }[]
}) => {
    const session=useSession();
    
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center py-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
                <div>
                
                    {(Number(session.data?.user?.id)===t.to)?<div className="text-sm">
                        Received INR
                    </div>:<div className="text-sm">
                        Sent INR
                    </div>}
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                {(Number(session.data?.user?.id)===t.to)?(
                <div className="flex  justify-center">
                    <span className="text-green-500 mr-2">+</span> Rs {t.amount / 100}
                </div>):<div className="flex  justify-center">
                    <span className="text-red-500 mr-2">-</span> Rs {t.amount / 100}
                </div>}
                

            </div>)}
        </div>
    </Card>
}