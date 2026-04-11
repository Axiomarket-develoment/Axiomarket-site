import { Suspense } from "react";
import MarketPage from "./MarketDetailsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>
      

    </div>}>
      <MarketPage/>
    </Suspense>
  );
}