import React, { useState } from "react";
import bgImage from './assets/bg.jpg';

interface PlayerIdModalProps {
	onSubmit: (id: number) => void;
}

const PlayerIdModal: React.FC<PlayerIdModalProps> = ({ onSubmit }) => {
	const [inputValue, setInputValue] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = () => {
		const id = Number(inputValue);
		if (id === 0 || id === 1) {
			onSubmit(id);
		} else {
			setErrorMessage("ID inválido. Por favor, insira 0 ou 1.");
		}
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div
				className="p-6 bg-gray-900 rounded-lg shadow-lg"
				style={{
					backgroundColor: "rgba(31, 41, 55, 0.8)",
					backdropFilter: "blur(10px)",
				}}
			>
				<label
					htmlFor="playerId"
					className="block mb-4 text-white text-lg font-bold"
				>
					Insira seu ID de jogador (0 ou 1):
				</label>
				<input
					id="playerId"
					type="number"
					min="0"
					max="1"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className="p-2 mb-4 w-full bg-gray-700 border border-gray-600 rounded-md text-white"
				/>
				{errorMessage && (
					<div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
				)}
				<button
					type="button"
					className="px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
					onClick={handleSubmit}
				>
					OK
				</button>
			</div>
		</div>
	);
};

export default PlayerIdModal;
