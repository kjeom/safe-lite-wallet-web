import { useSafeLite } from "@/hooks/useSafeLite";

export default function ExecuteTx() {
    const safeLiteWallet = useSafeLite()

    return (
        <div>
            <h1>Execute Transaction</h1>
        </div>
    ); 
}