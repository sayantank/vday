"use client";
import { useState, useEffect, useRef } from "react";
import VideoPlayer from "./VideoPlayer";
import PrankVideo from "./PrankVideo";

export type VDayProps = {
  for: "him" | "her";
  to: string;
  from: string;
  message: string;
};

export default function VDay(props: VDayProps) {
  const [stage, setStage] = useState<"first-video" | "second-video" | "message">("first-video");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio for message stage
  useEffect(() => {
    if (stage === "message") {
      audioRef.current = new Audio("/romantic.mp3");
      audioRef.current.loop = true;
      audioRef.current.muted = isMuted;
      audioRef.current.play();
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stage, isMuted]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleTransition = (nextStage: typeof stage) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(nextStage);
      setIsTransitioning(false);
    }, 500); // Half second delay for fade effect
  };

  const handleFirstVideoComplete = () => {
    handleTransition("second-video");
  };

  const handleSecondVideoComplete = () => {
    handleTransition("message");
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      <div
        className={`w-full h-full transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {stage === "first-video" && <PrankVideo onComplete={handleFirstVideoComplete} />}

        {stage === "second-video" && (
          <VideoPlayer
            src="/kiss.mp4"
            onComplete={handleSecondVideoComplete}
            autoPlay
          />
        )}

        {stage === "message" && (
          <div className="h-screen flex items-center justify-center bg-pink-100 relative overflow-hidden">
            <button
              onClick={handleMuteToggle}
              className="absolute top-4 right-4 text-pink-400 opacity-50 hover:opacity-100 transition-opacity z-20 text-sm"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
            <div className="text-center p-8 text-pink-700 relative z-10">
              <img
                src="/cat-rose.gif"
                alt="Cat with rose"
                className="w-48 h-48 object-contain mx-auto mb-8"
              />
              <h1 className="text-2xl mb-4 text-pink-800">Dear {props.to}</h1>
              <p className="mb-4">{props.message}</p>
              <p className="text-lg text-pink-600">Love, {props.from}</p>
            </div>
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={`heart-${i}`}
                  className="absolute animate-float text-2xl lg:text-4xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: "-20px",
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 3 + 4}s`,
                    opacity: 0,
                  }}
                >
                  {["❤️", "💖", "💝", "💕", "💗"][Math.floor(Math.random() * 5)]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
