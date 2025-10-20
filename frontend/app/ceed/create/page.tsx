// "use client"


// import { BACKEND_URL } from "@/app/config";
// import { Appbar } from "@/component/Appbar";
// import { LinkButton } from "@/component/buttons/LinkButton";
// import { PrimaryButton } from "@/component/buttons/PrimaryButton";
// import { CeedCell } from "@/component/CeedCell";
// import axios from "axios";
// import { useEffect, useState } from "react";

// function useAvailableActionsAndTriggers(){
//     const [availableActions, setAvailableActions] = useState<{ id: string; name: string; image: string }[]>([]);
//     const [availableTriggers, setAvailableTriggers] = useState<{ id: string; name: string; image: string }[]>([]);

//     useEffect(()=>{
//         axios.get(`${BACKEND_URL}/api/v1/action/available`)
//         .then(x=> setAvailableActions(x.data.availableActions))

//         axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
//         .then(x=> setAvailableTriggers(x.data.availableTriggers))
//     },[])

//     return { availableActions, availableTriggers };
// }

// export default function () {
//     const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();
//     const [selectedTrigger, setSelectedTrigger] = useState<{
//         id: string,
//         name:string
//     }>();
//     const [selectedActions, setSelectedActions] = useState<{
//         index: number,
//         availableActionId: string;
//         availableActionName: string;
//     }[]>([]);
//     const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

//     return <div>
//         <Appbar />
//         <div className="flex w-full min-h-screen bg-rose-50 flex-col justify-center">
//             <div className="flex justify-center w-full">
//                 <CeedCell onClick={()=>{
//                 setSelectedModalIndex(1);
//             }} name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"} index={1} />
//             </div>
//             <div className="py-2 w-full">
//                 {selectedActions.map((action, index) =>
//                     <div key={action.id || index} className="flex justify-center py-4">
//                         <CeedCell onClick={()=>{
//                 setSelectedModalIndex(action.index);
//             }} name={action.availableActionName ? action.availableActionName : "Action"} index={action.index} /></div>)}
//             </div>
//             <div className="flex justify-center">
//                 <div>
//                     <PrimaryButton onClick={() => {
//                         setSelectedActions(a => [...a, {
//                             index: a.length + 2,
//                             availableActionId: "",
//                             availableActionName: ""
//                         }])
//                     }}><div className="text-3xl">+</div></PrimaryButton>
//                 </div>
//             </div>
//         </div>
//         {selectedModalIndex && <Modal availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions }
//         onSelect={(props:null | {name: string; id: string;})=>{
//            if(props === null){
//             setSelectedModalIndex(null);
//             return
//            }
//            if(selectedModalIndex === 1){
//             setSelectedTrigger({
//                 id: props.id,
//                 name: props.name,
//             })
//            }else{ //@ts-ignore
//             setSelectedActions(a =>{
//                 let newActions = [...a];
//                 newActions[selectedModalIndex - 2] = {
//                     index: selectedModalIndex,
//                     availableActionId: props.id,
//                     availableActionName: props.name
//                 }
//             })
//            }
//            setSelectedModalIndex(null);
//         }} index={selectedModalIndex}/>}
//     </div>
// }
// //@ts-ignore
// function Modal({index, onSelect, availableItems }:{index: number, onSelect:(props:null | {name: string; id: string;})=> void, availableItems:{id: string, name: string, image: string}[]}){
//     return <div className="flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-200 bg-opacity-70">
//     <div className="relative p-4 w-full max-w-2xl max-h-full">

//         <div className="relative bg-white rounded-lg shadow-sm">

//             <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
//                 <div className="text-xl">
//                     Select {index === 1? "Trigger": "Action"}
//                 </div>
//                 <button onClick={()=>{
//                     onSelect(null);
//                 }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
//                     <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
//                         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
//                     </svg>
//                     <span className="sr-only">Close modal</span>
//                 </button>
//             </div>

//             <div className="p-4 md:p-5 space-y-4">
//             {availableItems?.map(({id, name, image})=>{
//                    return <div onClick={()=>{
//                    onSelect({id, name})
//                    }} key={id} className="flex border border-gray-300 p-4 cursor-pointer hover:bg-rose-50">
//                     <img src={image} width={30} className="rounded-full"/>
//                     <div className="flex felx-col justify-center">{name}</div>
//                    </div>
//                })}
//             </div>
//         </div>
//     </div>
// </div>
// }
"use client";

import { BACKEND_URL } from "@/app/config";
import { metadata } from "@/app/layout";
import { Appbar } from "@/component/Appbar";
import { PrimaryButton } from "@/component/buttons/PrimaryButton";
import { CeedCell } from "@/component/CeedCell";
import { Input } from "@/component/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AvailableItem = {
    id: string;
    name: string;
    image: string;
};

function useAvailableActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState<AvailableItem[]>([]);
    const [availableTriggers, setAvailableTriggers] = useState<AvailableItem[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/action/available`)
            .then((x) => setAvailableActions(x.data.availableActions));

        axios
            .get(`${BACKEND_URL}/api/v1/trigger/available`)
            .then((x) => setAvailableTriggers(x.data.availableTriggers));
    }, []);

    return { availableActions, availableTriggers };
}

export default function CeedCreatePage() {
    const router = useRouter();
    const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();

    const [selectedTrigger, setSelectedTrigger] = useState<{ id: string; name: string }>();
    const [selectedActions, setSelectedActions] = useState<{
            index: number;
            availableActionId: string;
            availableActionName: string;
            metadata: any;
        }[]
    >([]);
    const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

    return (
        <div>
            <Appbar />
            <div className="flex justify-end bg-rose-50 p-6">
                <PrimaryButton onClick={async () => {
                    if (!selectedTrigger?.id) {
                        return;
                    }

                    const response = await axios.post(`${BACKEND_URL}/api/v1/ceed`, {
                        "availableTriggerId": selectedTrigger?.id,
                        "triggerMetadata": {},
                        "actions": selectedActions.map(a => ({
                            "availableActionId": a.availableActionId,
                            "actionMetadata": a.metadata
                        }))
                    }, {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    })
                    router.push("/dashboard")
                }}
                >Publish</PrimaryButton>
            </div>
            <div className="flex w-full min-h-screen bg-rose-50 flex-col justify-center">
                {/* Trigger Cell */}
                <div className="flex justify-center w-full">
                    <CeedCell
                        onClick={() => setSelectedModalIndex(1)}
                        name={selectedTrigger?.name || "Trigger"}
                        index={1}
                    />
                </div>

                {/* Action Cells */}
                <div className="py-2 w-full">
                    {selectedActions.map((action, index) => (
                        <div key={index} className="flex justify-center py-4">
                            <CeedCell
                                onClick={() => setSelectedModalIndex(action.index)}
                                name={action.availableActionName || "Action"}
                                index={action.index}
                            />
                        </div>
                    ))}
                </div>

                {/* Add Action Button */}
                <div className="flex justify-center">
                    <div>
                        <PrimaryButton
                            onClick={() =>
                                setSelectedActions((a = []) => [
                                    ...a,
                                    {
                                        index: (a.length ?? 0) + 2,
                                        availableActionId: "",
                                        availableActionName: "",
                                        metadata:{}
                                    },
                                ])
                            }
                        >
                            <div className="text-3xl">+</div>
                        </PrimaryButton>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedModalIndex && (
                <Modal
                    availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions}
                    onSelect={(props: null | { name: string; id: string; metadata: any }) => {
                        if (!props) {
                            setSelectedModalIndex(null);
                            return;
                        }

                        if (selectedModalIndex === 1) {
                            setSelectedTrigger({
                                id: props.id,
                                name: props.name,
                            });
                        } else {
                            setSelectedActions((prev = []) => {
                                const newActions = [...prev];
                                newActions[selectedModalIndex - 2] = {
                                    index: selectedModalIndex,
                                    availableActionId: props.id,
                                    availableActionName: props.name,
                                    metadata: props.metadata
                                };
                                return newActions;
                            });
                        }

                        setSelectedModalIndex(null);
                    }}
                    index={selectedModalIndex}
                />
            )}
        </div>
    );
}

function Modal({
    index,
    onSelect,
    availableItems,
}: {
    index: number;
    onSelect: (props: null | { name: string; id: string; metadata: any }) => void;
    availableItems: AvailableItem[];
}) {

    const [step, setStep] = useState(0);
    const [selectedAction, setSelectedAction] = useState<{
        id:string,
        name:string
    }>();
    const isTrigger = index === 1;


    return <div className="flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-200 bg-opacity-70">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                    <div className="text-xl">Select {index === 1 ? "Trigger" : "Action"}</div>
                    <button
                        onClick={() => onSelect(null)}
                        type="button"
                        className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    >
                        <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">

                    {step === 1 && selectedAction?.id === "email" && <EmailSelector setMetadata={(metadata)=>{
                        onSelect({
                            ...selectedAction,
                            metadata
                        })
                    }} />}
                    {step === 1 && selectedAction?.id === "send-sol" && <SolanaSelector setMetadata={(metadata)=>{
                        onSelect({
                            ...selectedAction,
                            metadata
                        })
                    }} />}
                    {step === 0 && <div>{availableItems.map(({ id, name, image }) => (
                        <div key={id} onClick={() => {
                            if (isTrigger) {
                                onSelect({ id, name, metadata:{} })
                            } else {
                                setStep(s => s + 1);
                                setSelectedAction({ id, name })
                            }
                        }} className="flex gap-2 items-center border border-gray-300 p-4 cursor-pointer hover:bg-rose-50 rounded">
                            <img src={image} alt={name} width={30} className="rounded-full" />
                            <div>{name}</div>
                        </div>
                    ))}</div>}
                </div>
            </div>
        </div>
    </div>
}

function EmailSelector({setMetadata}:{
    setMetadata:(params: any)=>void;
}){
    const [email, setEmail] = useState("");
    const [body, setBody ] = useState("");

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e)=>setEmail(e.target.value)} ></Input>
        <Input label={"Body"} type={"text"} placeholder="Body" onChange={(e)=>setBody(e.target.value)} ></Input>
        <div className="py-4 pb-6">
            <PrimaryButton onClick={()=>{
            setMetadata({email, body})
        }}>Submit</PrimaryButton></div>
    </div>
}

function SolanaSelector({setMetadata}:{
    setMetadata:(params: any)=>void;
}){
    const [amount, setAmount ] = useState("");
    const [address, setAddress ] = useState("");

    return <div>
        <Input label={"To"} type={"text"} placeholder="address" onChange={(e)=>setAddress(e.target.value)} ></Input>
        <Input label={"amount"} type={"text"} placeholder="amount" onChange={(e)=>setAmount(e.target.value)} ></Input>
        <div className="py-4 pb-6">
            <PrimaryButton onClick={()=>{
            setMetadata({amount, address})
        }}>Submit</PrimaryButton></div>
    </div>
}
