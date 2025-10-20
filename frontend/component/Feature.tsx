
type FeatureProps = {
    title: string;
    subtitle: string;
};

export const Feature = ({ title, subtitle }: FeatureProps) => {
    return (
        <div className="flex felx-col justify-center tems-center">
            <div className="flex items-start gap-1 pl-5 py-4">
                <Check />
                <div className="flex gap-1">
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="text-sm text-gray-500">{subtitle}</div>
                </div>
            </div>
        </div>
    );
};

function Check() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-4 h-4 text-rose-600 mt-1"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
            />
        </svg>
    );
}
