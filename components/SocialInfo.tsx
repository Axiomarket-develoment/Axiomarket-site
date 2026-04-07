export function SocialInfo({ market }: { market: any }) {
    return (
        <div className="text-sm">
            <p>Public sentiment driven market</p>
            <p>Duration: {market.durationMinutes} mins</p>
        </div>
    );
}