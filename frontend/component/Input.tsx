"use client"

type inputtype = {
    label: string;
    onChange: (e: any) => void;
    placeholder: string;
    type?: "text" | "password"
}

export const Input = ({ label, placeholder, onChange, type = "text" }: inputtype) => {
    return <div className="py-3">
        <div className="font-semibold"><label>{label}</label></div>
        <input className="rounded border border-gray-400 px-6 py-2 w-full" type={type} placeholder={placeholder} onChange={onChange} />
    </div>
}