/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/PositionBoard";
import Console from "./Console";
import ShipPlacement from "./ShipPlacement";
import {
	posicionarNavio,
	checkServerHealth,
	verificarPosicionamentoNavioJogador,
	getFase,
	atacar,
} from "./services/navalBattle";
import PlayerIdModal from "./PlayerId";
import Alert from "./Alert";
import io from "socket.io-client";
import PositionBoard from "./components/PositionBoard";
import AttackBoard from "./components/AttackBoard";

const socket = io("http://localhost:3001");

function App() {
	const [playerId, setPlayerId] = useState<number | null>(null);
	const [fase, setFase] = useState("posicionamento"); // 'posicionamento' ou 'ataque'
	const [positionMatrix, setPositionMatrix] = useState<string[][]>(
		Array.from({ length: 10 }, () => Array(10).fill(null)),
	);
	const [attackMatrix, setAttackMatrix] = useState<string[][]>(
		Array.from({ length: 10 }, () => Array(10).fill(null)),
	);

	const [selectedShip, setSelectedShip] = useState<{
		name: string;
		size: number;
	} | null>(null);
	const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
		"horizontal",
	);
	const [responses, setResponses] = useState<any[]>([]);
	const [naviosPosicionados, setNaviosPosicionados] = useState(false);
	const [title, setTitle] = useState("Fase de posicionamento");
	const [message, setMessage] = useState("");
	const [gameState, setGameState] = useState(null);
	const [jogadorAtual, setJogadorAtual] = useState(0);
	const [ganhador, setGanhador] = useState(null);

	useEffect(() => {
		if (playerId === jogadorAtual) {
			setTitle("Sua vez de jogar");
		} else {
			setTitle("Aguarde sua vez de jogar");
		}
	}, [jogadorAtual]);

	useEffect(() => {
		const storedPlayerId = localStorage.getItem("playerId");
		console.log("storedPlayerId:", storedPlayerId);
		if (storedPlayerId) {
			setPlayerId(Number(storedPlayerId));
		}

		socket.on("connect", () => {
			console.log("Conectado ao servidor:", socket.id);
		});

		socket.on("disconnect", () => {
			console.log("Desconectado do servidor:", socket.id);
		});

		socket.on("estadoAtualizado", (game) => {
			setGameState(game);
		});

		socket.on("turnoAlterado", (data) => {
			console.log("TUrno alterado:", data.turnoAtual);
			setJogadorAtual(data.turnoAtual);
		});

		socket.on("faseAlterada", (data) => {
			if (data.fase === 0) {
				setFase("posicionamento");
				setTitle("Fase de posicionamento");
			} else if (data.fase === 1) {
				setFase("ataque");
				setTitle("Fase de ataque");
			} else if (data.fase === 2) {
				setFase("fim");
				setTitle("Fim de jogo");
			}
		});

		socket.on("fimDeJogo", (data) => {
			setFase("fim");
			console.log("Fim de jogo:", data);
			const { vencedor } = data;
			setGanhador(vencedor);
		});

		socket.on("ataqueRecebido", (data) => {
			const { tabuleiro } = data;

			console.log(
				"Seu id:",
				localStorage.getItem("playerId"),
				"Id do jogador que atacou:",
				data.playerId,
			);
			console.log(typeof playerId, typeof data.playerId);

			if (localStorage.getItem("playerId") != data.playerId) {
				console.log("Mudando");
				console.log(
					"Seu id:",
					localStorage.getItem("playerId"),
					"Id do jogador que atacou:",
					data.playerId,
				);

				setPositionMatrix(tabuleiro.posicionamento);
				console.log("Ataque recebido:", tabuleiro.posicionamento);
			}

			// setAttackMatrix((prevMatrix) => {
			// 	const newMatrix = [...prevMatrix];
			// 	newMatrix[data.y][data.x] = data.resultado;
			// 	return newMatrix;
			// });
		});
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("estadoAtualizado");
			socket.off("faseAlterada");
		};
	}, []);

	const handlePlayerIdSubmit = (id: number) => {
		setPlayerId(id);
		localStorage.setItem("playerId", id.toString());
	};

	const handleShipSelected = (
		ship: { name: string; size: number },
		orientation: "horizontal" | "vertical",
	) => {
		setSelectedShip(ship);
		setOrientation(orientation);
		console.log("Navio selecionado:", ship, orientation);
	};

	const handleCellPosition = (rowIndex: number, cellIndex: number) => {
		console.log("Fase de posicionamento");
		console.log("Célula clicada:", rowIndex + 1, cellIndex + 1);
		handleShipPlacement(rowIndex, cellIndex);
	};

	const handleCellAttack = async (rowIndex: number, cellIndex: number) => {
		if (playerId === jogadorAtual) {
			console.log("Fase de ataque");
			console.log("Célula clicada:", rowIndex + 1, cellIndex);

			console.log("Fase de ataque");
			const response = await handleAttack(rowIndex, cellIndex);
			const { sucesso, coordenada, tabuleiro, mensagem } = response;
			console.log("Resposta do ataque:", {
				sucesso,
				coordenada,
				tabuleiro,
				mensagem,
			});
			console.log("Resposta do ataque:", response);

			setAttackMatrix(tabuleiro.ataque);
			// setPositionMatrix(tabuleiro.posicionamento);

			setMessage(
				sucesso
					? `Navio atingido em {x: ${coordenada.x}, y: ${coordenada.y} }. Jogue novamente.`
					: `Água em {x: ${coordenada.x}, y: ${coordenada.y} }.`,
			);
		} else {
			console.log(playerId, jogadorAtual);
			console.log("Não é sua vez de jogar");
			setMessage("Não é sua vez de jogar caraio");
		}
	};

	const handleShipPlacement = async (rowIndex: number, cellIndex: number) => {
		if (selectedShip) {
			const position = { x: cellIndex, y: rowIndex };

			const { todosNavisPosicionados } =
				await verificarPosicionamentoNavioJogador(playerId!);

			if (todosNavisPosicionados) {
				console.log("Todos os seus navios já foram posicionados.");
				setMessage("Todos os seus navios já foram posicionados.");
			}

			posicionarNavio(playerId!, position, selectedShip.size, orientation)
				.then(async (response) => {
					setResponses((prevResponses) => [
						...prevResponses,
						{ type: "posicionarNavio", data: response },
					]);
					const { mensagem, sucesso, coordenadas, tabuleiro } = response;

					if (mensagem === "Navio posicionado com sucesso!") {
						setMessage(
							`Navio ${selectedShip.name} posicionado com sucesso em {x: ${position.x}, y: ${position.y} }.`,
						);
					}

					if (sucesso) {
						setPositionMatrix((prevMatrix) => {
							const newMatrix = [...prevMatrix];
							coordenadas.forEach(({ x, y }: { x: number; y: number }) => {
								newMatrix[y][x] = tabuleiro.posicionamento[y][x];
							});
							return newMatrix;
						});
					}

					const faseResponse = await getFase();
					console.log("Fase:", faseResponse);
					if (faseResponse.fase === "Ataque") {
						setFase("ataque");
						setTitle("Fase de ataque");
						setMessage(
							"Todos os navios foram posicionados. A fase de ataque começou!",
						);
					}
				})
				.catch((error) => {
					console.error("Erro ao posicionar navio:", error);
					setMessage("Erro ao posicionar navio.");
					setResponses((prevResponses) => [
						...prevResponses,
						{ type: "error", data: "Erro ao posicionar navio." },
					]);
				});
		} else {
			console.log("Nenhum navio selecionado.");
			setMessage("Você precisa selecionar um navio.");
		}
	};

	const updateMatrix = (matrix: string[][]) => {
		setPositionMatrix(matrix);
	};

	const handleAttack = async (rowIndex: number, cellIndex: number) => {
		console.log("Atacando célula:", rowIndex, cellIndex);
		try {
			const response = await atacar(playerId!, { x: cellIndex, y: rowIndex });
			console.log("Resposta do ataque:", response);
			setResponses((prevResponses) => [
				...prevResponses,
				{ type: "atacar", data: response },
			]);
			setMessage(
				`Ataque realizado na célula {x: ${cellIndex}, y: ${rowIndex}}.`,
			);
			return response;
		} catch (error) {
			console.error("Erro ao realizar ataque:", error);
			setMessage("Erro ao realizar ataque.");
			setResponses((prevResponses) => [
				...prevResponses,
				{ type: "error", data: "Erro ao realizar ataque." },
			]);
		}
	};

	const todosNaviosPosicionados = async (): Promise<boolean> => {
		console.log("Verificando posicionamento dos navios...", playerId);
		try {
			const navios = await verificarPosicionamentoNavioJogador(playerId!);
			const { todosNavisPosicionados } = navios;
			console.log("Navios:", todosNavisPosicionados);
			return navios.length === 5;
		} catch (error) {
			console.error("Erro ao verificar posicionamento dos navios:", error);
			return false;
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log("oi");
				const health = await checkServerHealth();
				console.log("Server health:", health);

				// const tabuleiro =
				const tabuleiro = Array.from({ length: 10 }, () =>
					Array(10).fill(null),
				);
				console.log("Tabuleiro:", tabuleiro);

				updateMatrix(tabuleiro);
			} catch (error) {
				console.error("Erro ao conectar com o backend:", error);
				setResponses(() => [
					{ type: "error", data: "Erro ao conectar com o backend." },
				]);
			}
		};

		if (playerId !== null) {
			fetchData();
		}
	}, [playerId]);

	useEffect(() => {
		console.log("Matrix atualizada:", positionMatrix);
		setPositionMatrix(positionMatrix);
	}, [positionMatrix]);

	useEffect(() => {
		setAttackMatrix(attackMatrix);
	}, [attackMatrix]);

	// useEffect(() => {
	//   setTimeout(() => {
	//     console.log("mudando para fase de ataque")
	//     setFase("ataque");
	// 					setTitle("Fase de ataque");
	//   }, 3000)
	// }, []);

	return (
		<div className="text-start text-white p-4 flex flex-col">
			{playerId === null ? (
				<PlayerIdModal onSubmit={handlePlayerIdSubmit} />
			) : (
				<>
					<div className="flex flex-col md:flex-row justify-center gap-1 items-center">
						{fase === "posicionamento" && (
							<>
								<ShipPlacement onShipSelected={handleShipSelected} />
								<PositionBoard
									matrix={positionMatrix}
									onCellClick={handleCellPosition}
								/>
							</>
						)}
						{fase === "ataque" && (
							<>
								<PositionBoard
									matrix={positionMatrix}
									onCellClick={handleCellPosition}
									disabled={true}
								/>
								<AttackBoard
									matrix={attackMatrix}
									onCellClick={handleCellAttack}
								/>
							</>
						)}
						{fase === "fim" && (
							<h1>Fim de jogo, o player {ganhador} ganhou!</h1>
						)}
					</div>
					<Alert title={title} message={message} />
					<Console responses={responses} />
				</>
			)}
		</div>
	);
}

export default App;
