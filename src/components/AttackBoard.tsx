import React, { useEffect, useState } from "react";
import { transformMatrixToBoard } from "../utils/transformMatrixToBoard";

interface BoardProps {
	matrix: string[][];
	onCellClick: (rowIndex: number, cellIndex: number) => void;
	disabled?: boolean;
}

const AttackBoard: React.FC<BoardProps> = ({
	matrix,
	onCellClick,
	disabled = false,
}) => {
	const [board, setBoard] = useState(
		Array.from({ length: 10 }, () => Array(10).fill(null)),
	);

	useEffect(() => {
		const newBoard = transformMatrixToBoard(matrix);
		setBoard(newBoard);
	}, [matrix]);

	const handleCellClickInternal = (rowIndex: number, cellIndex: number) => {
		if (!disabled) {
			onCellClick(rowIndex, cellIndex);
		}
	};

	const letters = "ABCDEFGHIJ".split("");
	const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

	return (
		<div className="flex flex-col items-center">
			<div
				className="bg-gray-800 p-4 rounded-lg border-2 border-red-700"
				style={{
					backgroundColor: "rgba(31, 41, 55, 0.8)",
					backdropFilter: "blur(10px)",
					boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.5)", // Red glow effect
				}}
			>
				<h2 className="text-2xl font-bold text-white mb-4 text-center">
					Tabuleiro de Ataque
				</h2>
				<div className="grid grid-cols-11 gap-1">
					{/* Empty top-left corner */}
					<div></div>
					{/* Numbers header */}
					{numbers.map((number) => (
						<div
							key={number}
							className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 text-white"
						>
							{number}
						</div>
					))}
					{/* Board with letters on the left */}
					{board.map((row, rowIndex) => (
						<React.Fragment key={rowIndex}>
							{/* Letter header */}
							<div className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 text-white">
								{letters[rowIndex]}
							</div>
							{row.map((cell, cellIndex) => (
								<div
									key={cellIndex}
									className={`w-6 h-6 sm:w-8 sm:h-8 border border-gray-700 rounded-md ${!disabled ? "hover:bg-gray-500" : ""}`}
									style={{
										backgroundColor: cell || "bg-gray-600",
										cursor: disabled ? "not-allowed" : "pointer",
									}}
									onClick={() => handleCellClickInternal(rowIndex, cellIndex)}
								>
									{/* Cell content */}
								</div>
							))}
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

export default AttackBoard;
