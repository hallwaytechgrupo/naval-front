import React, { useState, useEffect } from "react";

interface BoardProps {
	matrix: string[][];
	onCellClick: (rowIndex: number, cellIndex: number) => void;
}

const transformMatrixToBoard = (matrix: string[][]) => {
	return matrix.map((row) =>
		row.map((cell) => {
			console.log("atualizando...");
			if (cell === "N") {
				return "green";
			} else if (cell === "A") {
				return "red";
			} else if (cell === "O") {
				return "blue";
			} else {
				return null;
			}
		}),
	);
};

const Board: React.FC<BoardProps> = ({ matrix, onCellClick }) => {
	const [board, setBoard] = useState(
		Array.from({ length: 10 }, () => Array(10).fill(null)),
	);

	useEffect(() => {
		const newBoard = transformMatrixToBoard(matrix);
		setBoard(newBoard);
	}, [matrix]);

	const handleCellClickInternal = (rowIndex: number, cellIndex: number) => {
		onCellClick(rowIndex, cellIndex);
	};

	return (
		<div
			className="grid grid-cols-10 gap-1 bg-gray-800 p-4 rounded-lg"
			style={{
				backgroundColor: "rgba(31, 41, 55, 0.8)",
				backdropFilter: "blur(10px)",
			}}
		>
			{board.map((row, rowIndex) => (
				<React.Fragment key={rowIndex}>
					{row.map((cell, cellIndex) => (
						<div
							key={cellIndex}
							className="w-6 h-6 sm:w-10 sm:h-10 border border-gray-700 rounded-md hover:bg-gray-500"
							style={{ backgroundColor: cell || "bg-gray-600" }}
							onClick={() => handleCellClickInternal(rowIndex, cellIndex)}
						>
							{/* Conteúdo da célula, se necessário */}
						</div>
					))}
				</React.Fragment>
			))}
		</div>
	);
};

export default Board;
