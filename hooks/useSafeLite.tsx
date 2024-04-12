import { use, useEffect, useState } from "react"
import { useReadContract, useWalletClient } from "wagmi"
import * as safeLiteAbi from '@/abi/safeLite.json';
import { isAddress } from "web3-validator"


export const useSafeLite = (address:`0x${string}` | undefined = undefined) => {
    const { data: walletClient, isError, isLoading } = useWalletClient()
    const [safeLite, setSafeLite] = useState('')
    const isOwner = useReadContract({
        abi: safeLiteAbi.abi,
        address,
        functionName: 'isOwner',
        args: [walletClient?.account.address,],
    })

    useEffect(() => {
        if (address && isAddress(address) && isOwner.data === true) {
            setSafeLite(address)
        }
    }, [address, isOwner.data])
    return safeLite
}

