"use client"
import { useRouter } from "next/navigation"
import { LinkButton } from "./buttons/LinkButton"
import { PrimaryButton } from "./buttons/PrimaryButton"
import Image from 'next/image';


export const Appbar = () => {
    const router = useRouter()
    return <div className="flex border-b border-gray-200  justify-between py-2 px-24 sticky top-0 z-50 bg-white">
        <div className="font-extrabold italic text-3xl"><Image
      src="/images/ascend1.png"
      alt="Logo"
      width={120}
      height={60}
      quality={100} // 0–100 (lower = more compression)
    /></div>
        <div className="flex">
            <div className="pr-2"><LinkButton onClick={() => { }}>Contact sales</LinkButton></div>
            <div className="pr-2"><LinkButton onClick={() => { router.push("/login") }}>
                Log in</LinkButton></div>
            <PrimaryButton onClick={() => { router.push("/signup") }}>
                Sign up</PrimaryButton>
        </div>
    </div>
}