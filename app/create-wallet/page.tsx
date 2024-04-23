/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useWalletClient, useWaitForTransactionReceipt } from "wagmi"; // 지갑 클라이언트의 데이터 로딩 상태 관리
import * as safeLiteAbi from '@/abi/safeLite.json';
import { useEffect, useState } from "react";
import { isAddress } from "web3-validator";
import { useSafeLite } from "@/hooks/useSafeLite";
import { SafeLiteWalletContext } from "@/app/src/contexts/SafeLiteWalletContext";

export default function CreateWallet() { // 멀티시그 지갑 생성 컴포넌트
    const { data: walletClient, isError, isLoading } = useWalletClient() // 와그미에서 지갑 클라이언트와 관련된 데이터 가져오기
    const [safeLiteDeployTxHash, setSafeLiteDeployTxHash] = useState('') // 멀티시그 지갑 배포 트랜잭션의 해시를 저장, 지갑 생성 후 트랜잭션 상태를 확인
    const result = useWaitForTransactionReceipt({
        hash: safeLiteDeployTxHash as `0x${string}`,
    })
    const [threshold, setThreshold] = useState(0) // threshold 초기화
    const [owners, setOwners] = useState<`0x${string}`[]>(['0x',]) // owners 초기화
    const safeLiteWallet = useSafeLite(result?.data?.contractAddress ? result?.data?.contractAddress : undefined)

    const createHandler = async () => { // 지갑 생성 함수, 버튼 클릭 시 호출
        let invalidAddr = ''
        owners.map((owner) => { // 지갑만들 주소가 유효한지 확인
            if (!isAddress(owner)) { 
                invalidAddr = owner 
            }
        })
        if (invalidAddr) {
            alert('Invalid address: ' + invalidAddr) // 유효하지않은 주소가 존재하면 알림창
            return
        }
        if (threshold <= 0 || threshold > owners.length) {
            alert('Invalid threshold: ' + threshold)
            return
        }
        const contract = await walletClient?.deployContract({
            abi: safeLiteAbi.abi,
            bytecode: safeLiteAbi.bytecode as `0x${string}`,
            args: [8217, owners, threshold],
        })
        setSafeLiteDeployTxHash(contract ? contract : '')
        if (result.isFetched && result?.status !== 'success') {
            alert('Wallet Creation failed' + result?.error)
        }
        if (result.isFetched && result?.status == 'success') {
            alert('Wallet Creation succeed' + result?.error)
        }``
    }

    useEffect(() => {
        const newOwners = owners.slice()
        if (walletClient?.account.address) {
            newOwners[0] = walletClient?.account.address
            setOwners(newOwners)
        }
    }, [walletClient?.account.address])
    
    const ownerList = []
    for (let i = 0; i < owners.length; i++) {
        ownerList.push(
            <li key={i}>
                <input
                    {...i === 0 ? { readOnly: true } : {}}
                    type="text"
                    value={owners[i]}
                    onChange={(e) => {
                        const newOwners = owners.slice()
                        newOwners[i] = e.target.value as `0x${string}`
                        setOwners(newOwners)
                    }}
                />
            </li>
        )
    }

    return (
        <SafeLiteWalletContext.Provider value={safeLiteWallet}>
        <div>
            <h1>Create Wallet</h1>
            <ul>
                <h3>Owners</h3>
                <button onClick={() => {
                    setOwners(owners.concat('' as `0x${string}`))
                }}>
                    Add
                </button>
                <button onClick={() => {
                    if (owners.length === 1) {
                        alert('Cannot delete the first owner')
                        return
                    }
                    setOwners(owners.slice(0, owners.length - 1))
                }}>
                    Delete
                </button>
                {ownerList}
                <h3>Threshold</h3>
                <input
                    type="number"
                    value={threshold}
                    onChange={(e) => {
                        setThreshold(parseInt(e.target.value))
                    }}
                />
            </ul>
            <button onClick={createHandler}>Create</button>
            <h1>{safeLiteWallet}</h1>
        </div>
        </SafeLiteWalletContext.Provider>
    );
}