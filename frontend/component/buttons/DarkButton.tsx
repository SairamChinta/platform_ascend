
"use client"
import { ReactNode } from "react"


export const DarkButton = ({children, onClick}: {
    children: ReactNode,
     onClick: () => void,
    }) =>{
    return <div onClick={onClick} className="flex flex-col justify-center px-6 py-2 bg-purple-800 cursor-pointer hover:bg-purple-900 text-center hover:shadow-md text-2xl text-white rounded font-semibold `">
        {children}
    </div>
}