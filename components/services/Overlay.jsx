import React, { useEffect, useState } from "react";
import { overlayService } from "@/services";

export default function Overlay() {
  const [overlay, setOverlay] = useState(null);

  useEffect(() => {
    const subscription = overlayService.init.subscribe((overlay) =>
      setOverlay(overlay)
    );
    return () => subscription.unsubscribe();
  }, []);

  if (!overlay) return null;

  return <div className="z-[100] fixed inset-0"></div>;
}
