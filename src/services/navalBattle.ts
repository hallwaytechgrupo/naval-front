/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

const API_URL = "http://localhost:3001";

const checkServerHealth = async (): Promise<any> => {
	try {
		const response = await axios.get(`${API_URL}/health`);
		if (response.data.status === "Server is online") {
			console.log("Server is online");
			return response.data;
		}
	} catch (error) {
		console.error("Server is offline or unreachable");
		return { data: "Server is offline or unreachable" };
	}
};

const posicionarNavio = async (
	playerId: number,
	inicio: { x: number; y: number },
	comprimento: number,
	direcao: "horizontal" | "vertical",
): Promise<any> => {
	const response = await axios.post(`${API_URL}/posicionarNavio`, {
		playerId,
		inicio,
		comprimento,
		direcao,
	});
	console.log(response.data);
	return response.data;
};

const verificarPosicionamentoTodosNavios = async () => {
	const response = await axios.get(`${API_URL}{/todosNaviosPosicionados`);
	return response.data.todosPosicionados;
};

const verificarPosicionamentoNavioJogador = async (playerId: number) => {
	const response = await axios.get(`${API_URL}/naviosPorJogador/${playerId}`);
	return response.data;
};

export const atacar = async (
	playerId: number,
	coordinates: { x: number; y: number },
) => {
	try {
		const response = await axios.post(`${API_URL}/atacar`, {
			playerId,
			coordenada: coordinates,
		});
		console.log("Retornando do controller:", response.data);
		return response.data;
	} catch (error) {
		console.error("Erro ao realizar ataque:", error);
		throw error;
	}
};

// const getTabuleiro = async (playerId: number): Promise<any> => {
// 	const response = await axios.get(`${API_URL}/getTabuleiro/${playerId}`);
// 	const { tabuleiro } = response.data;
// 	console.log(tabuleiro.grade);

// 	return tabuleiro.grade;
// };

const getFase = async (): Promise<any> => {
	const response = await axios.get(`${API_URL}/fase`);
	return response.data;
};

export {
	checkServerHealth,
	posicionarNavio,
	verificarPosicionamentoTodosNavios,
	verificarPosicionamentoNavioJogador,
	getFase,
};
