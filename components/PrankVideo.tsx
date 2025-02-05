"use client";
import { useRef, useState, useEffect } from "react";

type PrankVideoProps = {
  onComplete: () => void;
};

export default function PrankVideo({ onComplete }: PrankVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [prankStage, setPrankStage] = useState(0); // 0: not started, 1: first button, 2: second button, 3: final button
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
      setPrankStage(1);
    }
  };

  const handlePrankButton = () => {
    setPrankStage((prev) => prev + 1);
  };

  const handleFinalStop = async () => {
    if (videoRef.current) {
      setIsPlaying(false);
      setHasStarted(false);
      setPrankStage(0);
      videoRef.current.pause();
      onComplete();
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  const getButtonPosition = (stage: number) => {
    switch (stage) {
      case 1:
        return "top-1/2 left-1/2";
      case 2:
        return "top-1/4 right-10";
      case 3:
        return "bottom-20 left-40";
      default:
        return "top-1/2 left-1/2";
    }
  };

  const getButtonText = (stage: number) => {
    switch (stage) {
      case 1:
        return "stop";
      case 2:
        return "please stop 🙏🏽";
      case 3:
        return "OMG STOP!!!!!!";
      default:
        return "what is this?";
    }
  };

  return (
    <div className="w-full h-dvh relative">
      <video
        ref={videoRef}
        loop={isPlaying}
        className="w-full h-full object-cover"
        playsInline
      >
        <source
          src="/videoplayback.mp4"
          type="video/mp4"
        />
        <track
          kind="captions"
          src="/captions.vtt"
          label="English"
        />
        Your browser does not support the video tag.
      </video>

      {!hasStarted && (
        <button
          type="button"
          onClick={handleStart}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white text-black px-4 py-2 shadow-lg hover:bg-gray-50 z-10 font-semibold"
        >
          what is this?
        </button>
      )}

      {hasStarted && isPlaying && prankStage > 0 && prankStage < 4 && (
        <button
          type="button"
          onClick={prankStage === 3 ? handleFinalStop : handlePrankButton}
          className={`absolute ${getButtonPosition(prankStage)} transform -translate-x-1/2 -translate-y-1/2 
                     bg-white text-black px-4 py-2 shadow-lg hover:bg-gray-50 z-10 font-semibold
                     transition-all duration-300`}
        >
          {getButtonText(prankStage)}
        </button>
      )}
    </div>
  );
}
