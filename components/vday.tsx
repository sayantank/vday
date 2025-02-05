"use client";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import PrankVideo from "./PrankVideo";

export type VDayProps = {
	for: "him" | "her";
	to: string;
	from: string;
	message: string;
};

export default function VDay(props: VDayProps) {
	const [stage, setStage] = useState<
		"first-video" | "second-video" | "message"
	>("first-video");

	console.log("Current stage:", stage);

	const handleFirstVideoComplete = () => {
		console.log("First video complete called");
		setStage("second-video");
	};

	const handleSecondVideoComplete = () => {
		console.log("Second video complete called");
		setStage("message");
	};

	if (stage === "first-video") {
		console.log("Rendering first video");
		return <PrankVideo onComplete={handleFirstVideoComplete} />;
	}

	if (stage === "second-video") {
		console.log("Rendering second video");
		return (
			<VideoPlayer
				src="/kiss.mp4"
				onComplete={handleSecondVideoComplete}
				autoPlay
			/>
		);
	}

	return (
		<div className="h-screen flex items-center justify-center">
			<div className="text-center p-8">
				<h1 className="text-2xl mb-4">Dear {props.to}</h1>
				<p className="mb-4">{props.message}</p>
				<p className="text-lg">Love, {props.from}</p>
			</div>
		</div>
	);
}
