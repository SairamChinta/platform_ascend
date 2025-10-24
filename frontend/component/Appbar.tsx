"use client";

import { useRouter } from "next/navigation";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import Image from 'next/image';
import { useEffect, useState } from "react";

export const Appbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
        <div className="flex border-b border-gray-200 justify-between py-2 px-24 sticky top-0 z-50 bg-white">
            <div className="font-extrabold italic text-3xl cursor-pointer" onClick={() => router.push(isLoggedIn ? "/dashboard" : "/")}>
                 <Image
                    src="/images/ascend1.png"
                    alt="Logo"
                    width={120}
                    height={60}
                    quality={100}
                    priority
                />
            </div>
            <div className="flex items-center">
                <div className="pr-4"><LinkButton onClick={() => { }}>Contact sales</LinkButton></div>

                {isLoggedIn ? (
                    <>
                        <div className="pr-4">
                            <LinkButton onClick={() => router.push("/dashboard")}>
                                Dashboard
                            </LinkButton>
                        </div>
                        <PrimaryButton onClick={handleLogout}>
                            Log out
                        </PrimaryButton>
                    </>
                ) : (
                    <>
                        <div className="pr-2">
                             <LinkButton onClick={() => router.push("/login")}>
                                Log in
                            </LinkButton>
                        </div>
                        <PrimaryButton onClick={() => router.push("/signup")}>
                            Sign up
                        </PrimaryButton>
                    </>
                )}
            </div>
        </div>
    );
};