import DownBar from "@/components/DownBar";
import MarketDetails from "@/components/MarketDetails";
import MobileNav from "@/components/MobileNav";
import { Market, markets } from "@/data/market";

export async function generateStaticParams() {
  return markets.map((m) => ({ id: m.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MarketPage({ params }: Props) {
  const { id } = await params;

  const market = markets.find((m) => m.id === id);

  if (!market) return <div>Market not found</div>;

  return (
    <div className=" space-y-4 bg-[#050505]">
     <MobileNav />

      {/* 👇 INTERACTIVE PART */}
      <MarketDetails market={market} />

      <DownBar />
    </div>
  );
}