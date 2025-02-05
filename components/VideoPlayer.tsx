"use client";
import { useRef, useState, useEffect } from "react";

type VideoPlayerProps = {
  src: string;
  onComplete: () => void;
  autoPlay?: boolean;
  loop?: boolean;
};

export default function VideoPlayer({
  src,
  onComplete,
  autoPlay = false,
  loop = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasStarted, setHasStarted] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set up video source and autoplay
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && autoPlay) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          setHasStarted(true);
        } catch (error) {
          console.error("Video play failed:", error);
        }
      }
    };

    playVideo();
  }, [autoPlay]);

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const handleStop = async () => {
    console.log("Stop button clicked");
    if (videoRef.current) {
      await videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setHasStarted(false);
      console.log("Calling onComplete");
      onComplete();
    }
  };

  const handleVideoEnd = () => {
    if (autoPlay && !loop) {
      setIsPlaying(false);
      setHasStarted(false);
      onComplete();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="w-full h-dvh relative">
      <video
        ref={videoRef}
        loop={isPlaying && (loop || !autoPlay)}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        playsInline
      >
        <source
          src={src}
          type="video/mp4"
        />
        <track
          kind="captions"
          src="/captions.vtt"
          label="English"
        />
        Your browser does not support the video tag.
      </video>

      {!hasStarted && !autoPlay && (
        <button
          type="button"
          onClick={handleStart}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                             bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 z-10"
        >
          Play Video
        </button>
      )}

      {hasStarted && isPlaying && !autoPlay && (
        <button
          type="button"
          onClick={handleStop}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                             bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 z-10"
        >
          Stop Video
        </button>
      )}
    </div>
  );
}
