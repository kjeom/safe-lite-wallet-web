'use client';

import { useWalletClient, useWaitForTransactionReceipt } from "wagmi";
import { useState } from 'react';
import { useSafeLite } from "@/hooks/useSafeLite";


export default function ExecuteTx() {
    const { data: walletClient, isError, isLoading } = useWalletClient() 
    const [to, setTo] = useState('');
    const [value, setValue] = useState(0);
    const [data, setData] = useState('');
    const [signatures, setSignatures] = useState([]);

    const safeLiteWallet = useSafeLite()
    
    const executeTransactionHandler = async () => {
        try {
            if (!safeLiteWallet) {
                alert("safeLiteWallet is not ready");
                return;
            }

            const transaction = await safeLiteWallet.executeTransaction({
                to: `0x${to}`,
                value: BigInt(value),
                data: `0x${data}`,
                signatures,
            });

            alert("suucced");
        } catch (error) {
            alert("failed" + error.message);
        }
    };

    // signMEssage()
    // sign message할 때 ethers.utils.arrayify(hash)로 넘겨보고, 안되면 메타마스크에서는 hash로 할 수 있으나
    // ethers import하고 위에 arrayify해서 signMessage wagmai의 기능 사용해서 하면 될 거 같다.
    // nonce읽는 거는 read contract, 트랜잭션 해시도 ui에서 read contract로 가져오기
    // function name에는 executeTransaction은 wrtieContract써서, address에 컨트랙트 어드레스, abi는 import되어있고,
    // args에다가 executeTransaction의 to, value, data, signatures 넣어주면 될 거 같다.

    return (
        <div>
            <h1>Execute Transaction</h1>
            <h1>{safeLiteWallet}</h1>
            <label htmlFor="to">To:</label>
            <input
                type="text"
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />
            <br />
            <label htmlFor="value">Value:</label>
            <input
                type="number"
                id="value"
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
            />
            <br />
            <label htmlFor="data">Data:</label>
            <input
                type="text"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
            <br />
            <button onClick={executeTransactionHandler}>Execute Transaction</button>
        </div>
    ); 
}