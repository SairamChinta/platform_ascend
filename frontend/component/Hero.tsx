"use client"

import { useRouter } from "next/navigation"
import { PrimaryButton } from "./buttons/PrimaryButton"
import { SecondaryButton } from "./buttons/SecondaryButton"
import { Feature } from "./Feature"
import Typewriter from "./Typewriter"

export const Hero = () => {
    const router = useRouter();
    return <div >

        <div className="flex mt-20 justify-center">
            <div onClick={()=>{
                router.push("/signup")
            }} className="flex items-center gap-1 text-sm font-normal py-1 px-4 max-w-md bg-rose-100 rounded-full">
                <span>Ascend Beyond Limits</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                </svg>
            </div>
        </div>

        <div className="flex justify-center">
            
            <div className="text-7xl font-black pt-4 pb-2 max-w-4xl">
                <span className="inline-block">Automate&nbsp;</span>
                <span className="inline-block w-[400px] text-left"><Typewriter /></span>
            </div>
        </div>
        <div className="flex justify-center">
            <div className="text-xl text-center text-gray-700 pt-4 max-w-2xl">
                Automation isn’t a request—it’s your superpower. With Ascend, you build, launch, and scale workflows on your terms. No blockers. No bottlenecks. The only limit is your imagination.</div>
        </div>
        <div className="flex justify-center pt-10">
            <div className="flex">
               <PrimaryButton onClick={() => {
                router.push("/signup")
               }} size="big">Get Started free</PrimaryButton>
            </div>
            <div className="pl-4">
               <SecondaryButton onClick={() => { }} size="big">Contact sales</SecondaryButton>
            </div>
        </div>
        <div className="flex justify-center pt-6 pb-8">
            <Feature title={"Free forever"} subtitle={"for core features"}/>
            <Feature title={"More apps"} subtitle={"morethan any other platforms"}/>
            <Feature title={"Cutting Edge"} subtitle={"AI Features"}/>
        </div>
    </div>
}