"use client";

import { useEffect, useState } from "react";
import ScreenSharing from "./_components/ScreenSharing";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient && <ScreenSharing />}
    </div>
  );
}