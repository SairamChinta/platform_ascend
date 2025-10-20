
"use client"
import { ReactNode } from "react"


export const PrimaryButton = ({children, onClick, size = "small"}: {
    children: ReactNode,
     onClick: () => void,
     size?: "big" | "small"
    }) =>{
    return <div onClick={onClick} className={`${size === "small" ? "text-sm": "text-xl"}
    ${size === "small" ? "px-4 py-2": "px-10 py-2"} bg-rose-600 cursor-pointer hover:bg-rose-700 text-center hover:shadow-md text-white rounded-full font-bold`} >
        {children}
    </div>
}