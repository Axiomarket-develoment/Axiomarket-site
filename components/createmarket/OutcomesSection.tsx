"use client";

interface Outcome {
    label: string;
}

interface Props {
    outcomes: Outcome[];
    setOutcomes: (o: Outcome[]) => void;
}

export default function OutcomesSection({
    outcomes,
    setOutcomes,
}: Props) {

    const updateOutcome = (index: number, value: string) => {
        const copy = [...outcomes];
        copy[index].label = value;
        setOutcomes(copy);
    };

    const removeOutcome = (index: number) => {
        setOutcomes(outcomes.filter((_, i) => i !== index));
    };

    return (
        <div className="mt-6">
            <div className="text-[#E4E4E4] text-sm mb-2">
                Outcomes
            </div>

            <div className="flex w-full gap-2 ">

                {outcomes.map((opt, idx) => (
                    <div
                        key={idx}
                        className="flex w-full gap-2 items-center"
                    >
                        <input
                            type="text"
                            value={opt.label}
                            placeholder="Outcome label"
                            onChange={(e) =>
                                updateOutcome(idx, e.target.value)
                            }
                            className="input text-[#8B8B8B] bg-[#0A0A0B] border-[#222] border py-2 px-2 rounded-md w-full"
                        />

                        {outcomes.length > 2 && (
                            <button
                                onClick={() => removeOutcome(idx)}
                                className="text-red-400 text-sm"
                            >
                                remove
                            </button>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
}