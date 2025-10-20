
"use client"
import { ReactNode } from "react"


export const SecondaryButton = ({children, onClick, size = "small"}: {
    children: ReactNode,
     onClick: () => void,
     size?: "big" | "small"
    }) =>{
    return <div onClick={onClick} className={`${size === "small" ? "text-sm": "text-xl"}
    ${size === "small" ? "px-4 pt-2": "px-10 py-2"} border border-black-500 cursor-pointer hover:bg-rose-50 hover:shadow-md text-black rounded-full font-bold`} >
        {children}
    </div>
}