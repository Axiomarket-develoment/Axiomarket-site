// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const width = window.innerWidth;

    if (width >= 1024) {
      router.replace("/home"); // large screen
    } else {
      router.replace("/market"); // small screen
    }
  }, [router]);

  return null;
}
