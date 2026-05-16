"use client";

interface Props {
    players: any[];
    selectedPlayer: any;
    setSelectedPlayer: (player: any) => void;

    openPlayers: boolean;
    setOpenPlayers: (v: boolean) => void;
}

export default function PlayerSelector({
    players,
    selectedPlayer,
    setSelectedPlayer,
    openPlayers,
    setOpenPlayers
}: Props) {

    if (!openPlayers) return null;

    return (
        <div className="mt-4">

            <div className="text-sm text-[#E4E4E4] mb-3">
                Select Player
            </div>

            <div className="grid grid-cols-2 gap-3">

                {players.map((player) => (

                    <button
                        key={player.playerId}
                        onClick={() => {
                            setSelectedPlayer(player);

                            // CLOSE SELECTOR
                            setOpenPlayers(false);
                        }}
                        className={`border rounded-xl p-3 flex items-center gap-3 transition ${selectedPlayer?.playerId === player.playerId
                                ? "border-[#FF394A] bg-[#111]"
                                : "border-[#222] bg-[#0A0A0B]"
                            }`}
                    >

                        <img
                            src={player.image}
                            alt={player.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        <div className="text-left">
                            <div className="text-sm text-white">
                                {player.name}
                            </div>

                            <div className="text-xs text-[#8B8B8B]">
                                {player.team}
                            </div>
                        </div>

                    </button>
                ))}

            </div>

        </div>
    );
}