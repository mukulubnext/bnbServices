// Notification Component

"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";

export default function Notification() {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const {user} = useAuth();

  const stayTimer = useRef<NodeJS.Timeout | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (localStorage.getItem("notif-dismissed")) return;

    setVisible(true);
    startCycle();

    return clearAllTimers;
  }, []);

  function clearAllTimers() {
    if (stayTimer.current) clearTimeout(stayTimer.current);
    if (fadeInterval.current) clearInterval(fadeInterval.current);
  }

  function startCycle() {
    setOpacity(1);

    // Stay visible for 5s
    stayTimer.current = setTimeout(startFade, 5000);
  }

  function startFade() {
    const duration = 5000;
    const start = Date.now();

    fadeInterval.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = elapsed / duration;

      if (progress >= 1) {
        clearInterval(fadeInterval.current!);
        setVisible(false);
        return;
      }

      setOpacity(1 - progress);
    }, 50);
  }

  function handleHover() {
    // Cancel everything and reset
    clearAllTimers();
    setOpacity(1);
  }

  function handleLeave() {
    // Start fresh cycle again
    startCycle();
  }

  const closeNow = () => {
    localStorage.setItem("notif-dismissed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  if(user && user.role === "seller"){
    return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1000 w-[95%] max-w-xl">
      <div
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        style={{ opacity }}
        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-dark/90 backdrop-blur-xl px-6 py-4 text-light shadow-2xl"
      >
        <div className="space-y-1">
          <p className="text-sm">
            Welcome to <span className="font-semibold">Boxes n Bottles</span> as
            a seller!
          </p>
          <p className="text-sm text-light/80">
            🎁 You’ve received{" "}
            <span className="font-semibold text-highlight">100 credits</span> as
            a gift from us.
          </p>
        </div>

        <button
          onClick={closeNow}
          className="text-light/60 hover:text-light transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

  }