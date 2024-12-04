import React from "react";

interface AlertProps {
	title: string;
	message: string;
	playerTurn: string;
}

const Alert: React.FC<AlertProps> = ({ title, message, playerTurn }) => {
	return (
		<div
			className="bg-gray-800 text-white p-4 mt-4 rounded-lg font-mono flex"
			style={{
				backgroundColor: "rgba(31, 41, 55, 0.8)",
				backdropFilter: "blur(10px)",
			}}
		>
			<div className="w-3/4">
				<h2 className="text-lg font-bold">{title}</h2>
				<pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
					{">"} {message}
				</pre>
			</div>
			<div className="w-1/4 flex items-center justify-center">
				<span>
					{playerTurn === "999" ||
					playerTurn === localStorage.getItem("playerId")
						? "Sua vez"
						: "Vez do adversário"}
				</span>
			</div>
		</div>
	);
};

export default Alert;
