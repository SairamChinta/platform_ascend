"use client"

import { Appbar } from "@/component/Appbar";
import { PrimaryButton } from "@/component/buttons/PrimaryButton";
import { CheckFeature } from "@/component/CheckFeature";
import { Input } from "@/component/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export default function Page() {
    const router = useRouter();
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-12 px-6">
        <div className="flex flex-col lg:flex-row max-w-7xl w-full gap-12">
          {/* Left Side */}
          <div className="flex-1 lg:px-10">
            <div className="font-bold text-4xl lg:text-5xl leading-tight py-6">
              <p>Join and</p>
              <p>automate your work</p>
              <p>using Ascend.</p>
            </div>

            <div className="space-y-4">
              <CheckFeature label="Easy setup, no coding required" />
              <CheckFeature label="Free forever for core features" />
              <CheckFeature label="14-day trial of premium features & apps" />
            </div>
          </div>

          {/* Right Side Form */}
          <div className="flex-1 border border-gray-300 rounded-xl p-6 shadow-md">
            <p className="text-sm text-gray-500 pb-4">* indicates a required field.</p>

            <div className="space-y-4">
              <Input label="*Name" type="text" placeholder="Your Name" onChange={(e) => {setName(e.target.value)}} />
              <Input label="*Email" type="text" placeholder="Your Email" onChange={(e) => {setEmail(e.target.value)}} />
              <Input label="*Password" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} />
            </div>

            <div className="pt-6">
              <PrimaryButton onClick={async() => {
                const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
                    email,
                    password,
                    name
                });
                router.push("/login");
              }} size="big"> Get started for free </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
