"use client"

import { Appbar } from "@/component/Appbar";
import { DarkButton } from "@/component/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { useRouter } from "next/navigation";
import { LinkButton } from "@/component/buttons/LinkButton";

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

function useCeeds() {
    const [loading, setLoading] = useState(true);
    const [ceeds, setCeeds] = useState<Ceed[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get(`${BACKEND_URL}/api/v1/ceed`,{
            headers: {
                "Authorization": token//`Bearer ${token}`
            }
        })
            .then(res => {
                setCeeds(res.data.ceeds);
                setLoading(false);
            })
    }, []);

    return {
        loading, ceeds

    }
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

export default function () {
    const { loading, ceeds } = useCeeds();
    const router = useRouter();

    return <div>
        <Appbar />
        <div className="flex justify-center pt-8">
            <div className=" max-w-screen-lg w-full">
                <div className="flex justify-between pr-8">
                    <div className="font-bold text-4xl">
                        My Ceeds</div>
                    <DarkButton onClick={() => {
                        router.push("/ceed/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading? "Loading.." : <div className="flex justify-center"><CeedTable ceeds={ceeds} /></div>}
    </div>
}