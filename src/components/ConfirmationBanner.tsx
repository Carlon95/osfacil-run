"use client";

import { useEffect, useState } from "react";

export function ConfirmationBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <p className="mb-4 rounded-lg bg-status-done-bg px-3 py-2 text-sm text-status-done">
      {message}
    </p>
  );
}
