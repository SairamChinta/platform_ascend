

export const CeedCell = ({
    name,
    index,
    onClick
}: {
    name?: string,
    index: number,
    onClick:()=> void;
}) => {

    return <div onClick={onClick} className="flex border border-black p-8 w-[350px] justify-center cursor-pointer ">
        <div className="flex text-xl">
            <div className="font-bold">
                {index}. 
            </div>
            <div>{name}</div>
        </div>
    </div>
}