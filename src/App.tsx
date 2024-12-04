/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import Console from "./Console";
import ShipPlacement from "./ShipPlacement";
import { checkServerHealth } from "./services/navalBattle";
import PlayerIdModal from "./PlayerId";
import Alert from "./Alert";
import io from "socket.io-client";
import PositionBoard from "./components/PositionBoard";
import AttackBoard from "./components/AttackBoard";
import { usePlayer } from "./utils/PlayerContext";

// const socketUrl =
// 	import.meta.env.DEV_OR_PROD === "prod"
// 		? import.meta.env.VITE_SOCKET_URL_PROD
// 		: import.meta.env.VITE_SOCKET_URL_DEV;

const socket = io("https://lobster-app-5i3ni.ondigitalocean.app");

function App() {
	// const [playerId, setPlayerId] = useState<number | null>(null);
	const { playerId, setPlayerId } = usePlayer();
	const [fase, setFase] = useState("posicionamento");
	const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
		"horizontal",
	);
	const [, setPositionedShips] = useState<Set<number>>(
		new Set(),
	);
	const [selectedShip, setSelectedShip] = useState<{
		name: string;
		size: number;
	} | null>(null);
	const [positionMatrix, setPositionMatrix] = useState<string[][]>(
		Array.from({ length: 10 }, () => Array(10).fill(null)),
	);
	const [attackMatrix, setAttackMatrix] = useState<string[][]>(
		Array.from({ length: 10 }, () => Array(10).fill(null)),
	);
	const [responses, setResponses] = useState<any[]>([]);
	const [title, setTitle] = useState("Fase de posicionamento");
	const [message, setMessage] = useState("");
	const [jogadorAtual, setJogadorAtual] = useState(999);
	const [minhaPontuacao, setMinhaPontuacao] = useState({
		posicoesTotais: 0,
		posicoesAtingidas: 0,
	});
	const [pontuacaoInimiga, setPontuacaoInimiga] = useState({
		posicoesTotais: 0,
		posicoesAtingidas: 0,
	});
	const [ganhador, setGanhador] = useState(null);
	const [loading, setLoading] = useState(true);
	const [, setForceRender] = useState(false);

	useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setForceRender(prev => !prev);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

	useEffect(() => {
		const storedPlayerId = localStorage.getItem("playerId");
		console.log("storedPlayerId:", storedPlayerId);
		if (storedPlayerId) {
			setPlayerId(Number(storedPlayerId));
		} else {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		socket.on("connect", () => {
			console.log("Conectado ao servidor:", socket.id);
			console.log("Recuperando estado do player");
			socket.emit("solicitarEstado");
		});

		socket.on("estadoAtual", (response) => {
			if (response.sucesso) {
				// Restaure o estado do jogo com base no memento recebido
				console.log("Estado atual recebido:", response.estado);

				const { estado } = response;

				setJogadorAtual(estado.turnoAtual);
				console.log("No memento, é a vez do jogador:", estado.turnoAtual);
				console.log("E o playerId salvo no state é:", playerId);

				const playerIdd = localStorage.getItem("playerId");
				console.log("playerId:", playerIdd);
				if (playerIdd !== null) {
					console.log("Fase recebida do memento:", estado.fase);
					if (estado.fase === 0) {
						setFase("posicionamento");
						setTitle("Fase de posicionamento");
						setJogadorAtual(999);
					} else if (estado.fase === 1) {
						setFase("ataque");
						setTitle("Fase de ataque");
					} else if (estado.fase === 2) {
						setFase("fim");
						setTitle("Fim de jogo");
					}

					setPositionMatrix(
						estado.tabuleiros[playerIdd].dePosicionamento.grade,
					);
					setAttackMatrix(estado.tabuleiros[playerIdd].deAtaque.grade);
					setPositionedShips(new Set(estado.positionedShips));
					const [pontuacao0, pontuacao1] = estado.pontuacao;
					if (Number(playerIdd) === 0) {
						const { posicoesAtingidas, posicoesTotais } = pontuacao0;
						setMinhaPontuacao({ posicoesAtingidas, posicoesTotais });

						const {
							posicoesAtingidas: inimigoPosicoesAtingidas,
							posicoesTotais: inimigoPosicoesTotais,
						} = pontuacao1;
						setPontuacaoInimiga({
							posicoesAtingidas: inimigoPosicoesAtingidas,
							posicoesTotais: inimigoPosicoesTotais,
						});
					} else {
						const { posicoesAtingidas, posicoesTotais } = pontuacao0;
						setPontuacaoInimiga({ posicoesAtingidas, posicoesTotais });

						const {
							posicoesAtingidas: inimigoPosicoesAtingidas,
							posicoesTotais: inimigoPosicoesTotais,
						} = pontuacao1;
						setMinhaPontuacao({
							posicoesAtingidas: inimigoPosicoesAtingidas,
							posicoesTotais: inimigoPosicoesTotais,
						});
					}
				}
			} else {
				console.log("Falha ao restaurar estado:", response.mensagem);
			}
			setLoading(false);
		});

		socket.on("estadoRestaurado", (response) => {
			if (response.sucesso) {
				console.log("Estado restaurado com sucesso");
			} else {
				console.log("Falha ao restaurar estado:", response.mensagem);
			}
		});

		socket.on("disconnect", () => {
			console.log("Desconectado do servidor:", socket.id);
		});

		socket.on("pontuacao", (response) => {
			console.log("Pontuação atualizada");
			console.log("Pontuação:", response);

			const [minha, inimiga] = response;
			setMinhaPontuacao(minha);
			setPontuacaoInimiga(inimiga);
		});

		socket.on("navioPosicionado", (resultado) => {
			console.log("Navio posicionado:", resultado);

			const { mensagem, sucesso, coordenadas, tabuleiro } = resultado;
			if (sucesso) {
				console.log("mensagem:", mensagem);
				if (mensagem === "Navio posicionado com sucesso.") {
					setMessage(`Navio posicionado com sucesso`);
				}

				setPositionMatrix((prevMatrix) => {
					const newMatrix = [...prevMatrix];
					coordenadas.forEach(({ x, y }: { x: number; y: number }) => {
						newMatrix[y][x] = tabuleiro.posicionamento[y][x];
					});
					return newMatrix;
				});
			} else {
				console.log("mensagem:", mensagem);
				socket.emit("getFase", (response: { fase: number }) => {
					const { fase } = response;
					console.log("mutando a fase", fase);
					if (fase === 0) {
						setFase("posicionamento");
						setTitle("Fase de posicionamento");
						setJogadorAtual(999);
					} else if (fase === 1) {
						setFase("ataque");
						setTitle("Fase de ataque");
					} else if (fase === 2) {
						setFase("fim");
						setTitle("Fim de jogo");
					}
				});
				setMessage(mensagem);
			}
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
				const msg = data.sucesso
					? `acertou um navio em {x: ${data.coordenada.x}, y: ${data.coordenada.y} }.`
					: `errou, água em {x: ${data.coordenada.x}, y: ${data.coordenada.y} }.`;

				setMessage("O inimigo atacou e " + msg);
			}
		});

		socket.on("ataqueResultado", (response) => {
			console.log("Resultado do ataque:", response);
			// Atualize o estado do jogo conforme necessário

			const { sucesso, coordenada, tabuleiro, mensagem } = response;
			console.log("Resposta do ataque:", {
				sucesso,
				coordenada,
				tabuleiro,
				mensagem,
			});
			console.log("Resposta do ataque:", response);

			setAttackMatrix(tabuleiro.ataque);

			setMessage(
				sucesso
					? `Navio atingido em {x: ${coordenada.x}, y: ${coordenada.y} }. Jogue novamente.`
					: `Água em {x: ${coordenada.x}, y: ${coordenada.y} }.`,
			);
		});

		socket.on("turnoAlterado", (data) => {
			console.log("Turno alterado:", data.turnoAtual);
			setJogadorAtual(data.turnoAtual);
		});

		socket.on("faseAlterada", (data) => {
			if (data.fase === 0) {
				setFase("posicionamento");
				setTitle("Fase de posicionamento");
				setJogadorAtual(999);
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
			setTimeout(() => {
				setPlayerId(null);
				setFase("posicionamento");
				setOrientation("horizontal");
				setPositionedShips(new Set());
				setSelectedShip(null);
				setPositionMatrix(
					Array.from({ length: 10 }, () => Array(10).fill(null)),
				);
				setAttackMatrix(Array.from({ length: 10 }, () => Array(10).fill(null)));
				setResponses([]);
				setTitle("Fase de posicionamento");
				setMessage("");
				setJogadorAtual(999);
				setMinhaPontuacao({ posicoesTotais: 0, posicoesAtingidas: 0 });
				setPontuacaoInimiga({ posicoesTotais: 0, posicoesAtingidas: 0 });
				setGanhador(null);
				localStorage.removeItem("playerId");
				window.location.reload();
			}, 5000);
		});

		socket.on("pontuacao", (response) => {
			console.log("Pontuação atualizada");
			console.log("Pontuação:", response);

			const playerId = Number(localStorage.getItem("playerId"));
			const [pontuacao0, pontuacao1] = response;
			if (playerId === 0) {
				setMinhaPontuacao(pontuacao0);
				setPontuacaoInimiga(pontuacao1);
			} else {
				setMinhaPontuacao(pontuacao1);
				setPontuacaoInimiga(pontuacao0);
			}
		});

		socket.on("navioPosicionado", (resultado) => {
			console.log("Navio posicionado:", resultado);

			const { mensagem, sucesso, coordenadas, tabuleiro } = resultado;
			if (sucesso) {
				console.log("mensagem:", mensagem);
				if (mensagem === "Navio posicionado com sucesso." && selectedShip) {
					setMessage(`Navio posicionado com sucesso`);
					setPositionedShips((prevShips) =>
						new Set(prevShips).add(selectedShip.size),
					);
					setSelectedShip(null);
				}

				setPositionMatrix((prevMatrix) => {
					const newMatrix = [...prevMatrix];
					coordenadas.forEach(({ x, y }: { x: number; y: number }) => {
						newMatrix[y][x] = tabuleiro.posicionamento[y][x];
					});
					return newMatrix;
				});
			}
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("estadoAtual");
			socket.off("estadoRestaurado");
			socket.off("pontuacao");
			socket.off("navioPosicionado");
			socket.off("ataqueRecebido");
			socket.off("ataqueResultado");
			socket.off("turnoAlterado");
			socket.off("faseAlterada");
			socket.off("fimDeJogo");
		};
	}, [playerId]);

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
			await handleAttack(rowIndex, cellIndex);
		} else {
			setMessage("Não é o seu turno.");
		}
	};

	const handleShipPlacement = async (rowIndex: number, cellIndex: number) => {
		// aqui
		if (selectedShip) {
			socket.emit("getFase", (response: { fase: number }) => {
				const { fase } = response;
				if (fase === 0) {
					setFase("posicionamento");
					setTitle("Fase de posicionamento");
					setJogadorAtual(999);
				} else if (fase === 1) {
					setFase("ataque");
					setTitle("Fase de ataque");
				} else if (fase === 2) {
					setFase("fim");
					setTitle("Fim de jogo");
				}
			});
			setPositionedShips((prevShips) =>
				new Set(prevShips).add(selectedShip.size),
			);

			const position = { x: cellIndex, y: rowIndex };
			const obj = {
				playerId: playerId,
				inicio: position,
				comprimento: selectedShip.size,
				direcao: orientation,
			};
			socket.emit("posicionarNavio", obj);
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

		console.log("playerId:", playerId);

		const ataque = {
			playerId,
			coordenada: { x: cellIndex, y: rowIndex },
		};

		socket.emit("atacar", ataque);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (fase === "posicionamento") {
					setJogadorAtual(999);
				}
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
			setLoading(false);
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

	return (
		<div className="text-start text-white p-4 flex flex-col">
			{loading ? (
				<div>Carregando...</div>
			) : (
				<>
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
											disabled={playerId !== jogadorAtual}
										/>
									</>
								)}
								{fase === "fim" && (
									<h1>Fim de jogo, o player {ganhador} ganhou!</h1>
								)}
							</div>
							<Alert
								title={title}
								message={message}
								playerTurn={jogadorAtual.toString()}
							/>
							<Console
								responses={responses}
								fase={fase}
								minhaPontuacao={minhaPontuacao}
								pontuacaoInimiga={pontuacaoInimiga}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default App;
