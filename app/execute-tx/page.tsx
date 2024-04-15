'use client';

import { useState } from 'react';
import { useSafeLite } from "@/hooks/useSafeLite";

export default function ExecuteTx() {
    const [to, setTo] = useState('');
    const [value, setValue] = useState(0);
    const [data, setData] = useState('');
    const [signatures, setSignatures] = useState([]);

    const safeLiteWallet = useSafeLite()

    const executeTransaction = async () => {
        try {
            const result = await safeLiteWallet.executeTransaction(to, value, data);
            alert("성공");
        } catch (error) {
            alert("실패");
        }
    };

    return (
        <div>
            <h1>Execute Transaction</h1>
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
            <button onClick={executeTransaction}>Execute Transaction</button>
        </div>
    ); 
}