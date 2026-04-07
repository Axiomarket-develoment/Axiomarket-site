export function SportTeams({ event }: { event: any }) {
    if (!event?.participants || !event?.participantImages) return null;

    return (
        <div className="flex items-center justify-between mb-3">
            <img src={event.participantImages[0]} alt={event.participants[0]} className="w-10 h-10" />
            <div className="flex items-center gap-2 text-sm font-semibold">
                <span>{event.participants[0]}</span>
                <span className="text-gray-400">vs</span>
                <span>{event.participants[1]}</span>
            </div>
            <img src={event.participantImages[1]} alt={event.participants[1]} className="w-10 h-10" />
        </div>
    );
}