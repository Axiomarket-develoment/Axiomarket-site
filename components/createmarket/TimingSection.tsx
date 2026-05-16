"use client";

interface Props {
    style: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    setStartDate: (v: string) => void;
    setStartTime: (v: string) => void;
    setEndDate: (v: string) => void;   // 🔥 ADD THIS
    setEndTime: (v: string) => void;
}

export default function
    TimingSection({
        style,
        startDate,
        startTime,
        endDate,
        endTime,
        setStartDate,
        setStartTime,
        setEndDate,
        setEndTime
    }: Props) {
    return (
        <div className="mt-5">
            <div className="text-[#E4E4E4] text-sm mb-2">Timing</div>

            <div className="grid grid-cols-1 gap-3">

                {/* START DATE */}
                <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input border-[#222] text-[#8B8B8B] bg-[#0A0A0B] placeholder:text-[#8B8B8B] text-sm placeholder:text-sm border py-3 px-2 rounded-md my-1"
                    />
                </div>

                {/* START TIME */}
                <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="start-time">Start Time</label>
                    <input
                        type="time"
                        id="start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="input border-[#222] text-[#8B8B8B] placeholder:text-[#8B8B8B]  bg-[#0A0A0B] text-sm placeholder:text-sm border py-3 px-2 rounded-md my-1"
                    />
                </div>

                {/* END DATE */}
                <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => {
                            if (style === "Player" || style === "Team") {
                                setEndDate(e.target.value);
                            }
                        }}
                        readOnly={style === "Match" || style === "Outcome"}

                        className="input border-[#222] text-[#8B8B8B] bg-[#0A0A0B] text-sm border py-3 px-2 rounded-md my-1"
                    />
                </div>

                {/* END TIME */}
                <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="end-time">End Time</label>
                    <input
                        type="time"
                        id="end-time"
                        value={endTime}
                        onChange={(e) => {
                            if (style === "Player" || style === "Team") {
                                setEndTime(e.target.value);
                            }
                        }}
                        readOnly={style === "Match" || style === "Outcome"}

                        className="input border-[#222] text-[#8B8B8B] bg-[#0A0A0B] text-sm border py-3 px-2 rounded-md my-1"
                    />
                </div>

            </div>
        </div>
    );
}