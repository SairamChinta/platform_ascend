"use client"

import { Appbar } from "@/component/Appbar";
import { DarkButton } from "@/component/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { useRouter } from "next/navigation";
import { LinkButton } from "@/component/buttons/LinkButton";
import { PrimaryButton } from "@/component/buttons/PrimaryButton";
import { Input } from "@/component/Input"; 

interface Ceed {
    id: string,
    triggerId: string,
    userId: number,
    actions: {
        id: string,
        ceedId: string,
        actionId: string,
        sortingOrder: number,
        type: {
            id: string,
            name: string,
            image: string
        }
    }[],
    trigger:{
        id: string,
        ceedId: string,
        triggerId: string,
        type:{
            id:string,
            name:string,
            image: string
        }
    }
}

interface User {
    name: string;
    email: string;
    isSenderVerified: boolean;
    isSolKeySet: boolean;
}

function useCeeds() {
    const [loading, setLoading] = useState(true);
    const [ceeds, setCeeds] = useState<Ceed[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get(`${BACKEND_URL}/api/v1/ceed`,{
            headers: {
                "Authorization": token
            }
        })
            .then(res => {
                setCeeds(res.data.ceeds);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch ceeds", err);
                setLoading(false);
            });
    }, []);

    return {
        loading, ceeds
    }
}

// Hook to fetch user data
function useUser() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`${BACKEND_URL}/api/v1/user/`, {
            headers: {
                "Authorization": token
            }
        })
            .then(res => {
                setUser(res.data.user);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch user", err);
                setLoading(false);
            });
    }, []);

    return { loading, user };
}

function CeedTable( {ceeds}:{ceeds: Ceed[]} ){
    const router = useRouter();

    return <div className="p-8 max-w-screen-lg w-full">
    <div className="grid grid-cols-5 text-left font-semibold text-gray-600 uppercase text-sm border-b pb-2">
      <div>Name</div>
      <div>ID</div>
      <div>Created at</div>
      <div>Webhook URL</div>
      <div>Go</div>
    </div>
  
    {ceeds.map(z => (
      <div
        key={z.id}
        className="grid grid-cols-5 items-center py-4 border-b"
      >
        <div className="flex items-center space-x-2">
          <img
            src={z.trigger.type.image}
            className="w-8 h-8 border border-gray-300 p-1"
          />
          {z.actions.map((x, i) => (
            <img
              key={i}
              src={x.type.image}
              className="w-8 h-8 border border-gray-300 p-1"
            />
          ))}
        </div>
        <div className="">{z.id}</div>
        <div className="">Apr 12, 1972</div>
        <div className="">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
        <div>
          <LinkButton
            onClick={() => {
              router.push("/ceed/" + z.id);
            }}
          >
            Go
          </LinkButton>
        </div>
      </div>
    ))}
  </div>
  
}

function SenderVerification() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleVerifySender = async () => {
        setMessage("");
        setError("");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You are not logged in.");
                return;
            }

            const res = await axios.post(
                `${BACKEND_URL}/api/v1/user/verify-sender`, 
                {}, 
                {
                    headers: { 'Authorization': token }
                }
            );
            
            setMessage(res.data.message);

        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || "An error occurred.");
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="p-4 mb-6 border border-gray-300 rounded-xl shadow-md">
            <h2 className="font-semibold text-lg">Send Emails as You</h2>
            <p className="text-gray-600 my-2 text-sm">
                To send emails to your clients using your own email address, 
                you must first verify it. Click the button to receive a 
                verification link from AWS.
            </p>
            
            <PrimaryButton onClick={handleVerifySender} size="big">
                Verify Sender Email
            </PrimaryButton>

            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
}

function SolanaKeyComponent() {
    const [key, setKey] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSaveKey = async () => {
        setMessage("");
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/user/save-key`, 
                { privateKey: key }, 
                { headers: { 'Authorization': token } }
            );
            setMessage(res.data.message);
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="p-4 mb-6 border border-gray-300 rounded-xl shadow-md">
            <h2 className="font-semibold text-lg">Set Your Solana Wallet</h2>
            <p className="text-gray-600 my-2 text-sm">
                To send SOL payments, you must provide your wallet's private key. 
                It will be encrypted and stored securely.
            </p>
            
            <Input 
                label="Solana Private Key" 
                type="password" 
                placeholder="Enter your base58 private key" 
                onChange={(e) => setKey(e.target.value)} 
            />

            <div className="pt-4">
                <PrimaryButton onClick={handleSaveKey} size="big">
                    Save Private Key
                </PrimaryButton>
            </div>

            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
}

export default function () {
    const { loading: ceedsLoading, ceeds } = useCeeds();
    const { loading: userLoading, user } = useUser();
    const router = useRouter();

    const loading = ceedsLoading || userLoading;

    return <div>
        <Appbar />
        <div className="flex justify-center pt-8">
            <div className=" max-w-screen-lg w-full px-4"> 
                {!loading && user && (
                    <>
                        {!user.isSenderVerified && <SenderVerification />}
                        {!user.isSolKeySet && <SolanaKeyComponent />}
                    </>
                )}

                <div className="flex justify-between pr-4 mt-6">
                    <div className="font-bold text-4xl">
                        My Ceeds
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/ceed/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"><CeedTable ceeds={ceeds} /></div>}
    </div>
}