export enum CellState {
	Navio = "N",
	Agua = "A",
	Acertado = "X",
	Errado = "O",
}

const cellColorMap: { [key in CellState]: string } = {
	[CellState.Navio]: "green",
	[CellState.Agua]: "red",
	[CellState.Acertado]: "black",
	[CellState.Errado]: "blue",
};

export const transformMatrixToBoard = (matrix: string[][]) => {
	return matrix.map((row) =>
		row.map((cell) => {
			return cellColorMap[cell as CellState] || null;
		}),
	);
};
