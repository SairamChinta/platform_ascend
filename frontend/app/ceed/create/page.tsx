"use client";

import { BACKEND_URL } from "@/app/config";
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
                         alert("Please select a trigger first.");
                        return;
                    }
                     if (selectedActions.length === 0) {
                          alert("Please add at least one action.");
                          return;
                     }
                      if (selectedActions.some(a => !a.availableActionId)) {
                          alert("Please configure all added actions before publishing.");
                          return;
                      }

                    try {
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
                        });
                        router.push("/dashboard");
                    } catch (error) {
                         console.error("Failed to publish ceed:", error);
                         alert("Failed to publish workflow. Check console for details.");
                    }
                }}
                >Publish</PrimaryButton>
            </div>
            <div className="flex w-full min-h-screen bg-rose-50 flex-col justify-center">
                <div className="flex justify-center w-full">
                    <CeedCell
                        onClick={() => setSelectedModalIndex(1)}
                        name={selectedTrigger?.name || "Trigger"}
                        index={1}
                        isConfigured={!!selectedTrigger?.id}
                    />
                </div>

                <div className="py-2 w-full">
                    {selectedActions.map((action) => (
                        <div key={action.index} className="flex justify-center py-4">
                            <CeedCell
                                onClick={() => setSelectedModalIndex(action.index)}
                                name={action.availableActionName || "Action"}
                                index={action.index}
                                isConfigured={!!action.availableActionId}
                            />
                        </div>
                    ))}
                </div>

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

            {selectedModalIndex !== null && (
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
                                const actionIndexToUpdate = prev.findIndex(a => a.index === selectedModalIndex);
                                if (actionIndexToUpdate !== -1) {
                                    newActions[actionIndexToUpdate] = {
                                        ...newActions[actionIndexToUpdate],
                                        availableActionId: props.id,
                                        availableActionName: props.name,
                                        metadata: props.metadata
                                    };
                                }
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
                    <div className="text-xl">Select {index === 1 ? "Trigger" : "Action"} { step > 0 && ` > Configure ${selectedAction?.name}` }</div>
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
                         // --- Logic Change: Assert selectedAction type ---
                        onSelect({
                            ...(selectedAction as {id: string, name: string}),
                            metadata
                        })
                    }} />}
                    {step === 1 && selectedAction?.id === "send-sol" && <SolanaSelector setMetadata={(metadata)=>{
                        onSelect({
                            ...(selectedAction as {id: string, name: string}),
                            metadata
                        })
                    }} />}
                    {step === 0 && <div>{availableItems.map(({ id, name, image }) => (
                        <div key={id} onClick={() => {
                            if (isTrigger) {
                                onSelect({ id, name, metadata:{} }) // Triggers skip step 1
                            } else {
                                setStep(s => s + 1);
                                setSelectedAction({ id, name })
                            }
                        }} className="flex gap-2 items-center border border-gray-300 p-4 cursor-pointer hover:bg-rose-50 rounded mb-2"> {/* Added mb-2 */}
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
    setMetadata:(params: { email: string; body: string }) => void;
}){
    const [email, setEmail] = useState("");
    const [body, setBody ] = useState("");

    return <div className="space-y-4">
        <Input label={"To"} type={"text"} placeholder="e.g., recipient@example.com or {comment.email}" onChange={(e)=>setEmail(e.target.value)} />
        <Input label={"Body"} type={"text"} placeholder="e.g., Thank you! or Body: {comment.body}" onChange={(e)=>setBody(e.target.value)} />
        <div className="py-4 pb-6">
            <PrimaryButton onClick={()=>{
                 if (!email || !body) {
                      alert("Please fill in both 'To' and 'Body' fields.");
                      return;
                 }
                setMetadata({email, body})
            }}>Submit</PrimaryButton></div>
    </div>
}

function SolanaSelector({setMetadata}:{
    setMetadata:(params: { amount: string; address: string }) => void;
}){
    const [amount, setAmount ] = useState("");
    const [address, setAddress ] = useState("");

    return <div className="space-y-4">
        <Input label={"Amount (SOL)"} type={"text"} placeholder="e.g., 0.1 or {comment.amount}" onChange={(e)=>setAmount(e.target.value)} />
        <Input label={"Recipient Address"} type={"text"} placeholder="e.g., SolanaWalletAddress... or {comment.address}" onChange={(e)=>setAddress(e.target.value)} />
        <div className="py-4 pb-6">
            <PrimaryButton onClick={()=>{
                 if (!amount || !address) {
                      alert("Please fill in both 'Amount' and 'Recipient Address' fields.");
                      return;
                 }
                setMetadata({amount, address})
            }}>Submit</PrimaryButton></div>
    </div>
}