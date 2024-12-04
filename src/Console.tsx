interface ConsoleProps {
	responses: Array<{
		type: string;
		data: any;
	}>;
	fase: string;
	minhaPontuacao: {
		posicoesTotais: number;
		posicoesAtingidas: number;
	};
	pontuacaoInimiga: {
		posicoesTotais: number;
		posicoesAtingidas: number;
	};
}

const Console: React.FC<ConsoleProps> = ({
	responses,
	fase,
	minhaPontuacao,
	pontuacaoInimiga,
}) => {
	return (
		<div
			className="bg-gray-800 text-white p-4 mt-4 rounded-lg font-mono h-40 overflow-y-auto"
			style={{
				backgroundColor: "rgba(31, 41, 55, 0.8)",
				backdropFilter: "blur(10px)",
			}}
		>
			<h2 className="text-lg font-bold">Console</h2>
			{fase === "ataque" ? (
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h3 className="text-md font-bold">Pontuação Minha</h3>
						<p>Posições Totais: {minhaPontuacao.posicoesTotais}</p>
						<p>Posições Atingidas: {minhaPontuacao.posicoesAtingidas}</p>
					</div>
					<div>
						<h3 className="text-md font-bold">Pontuação Inimiga</h3>
						<p>Posições Totais: {pontuacaoInimiga.posicoesTotais}</p>
						<p>Posições Atingidas: {pontuacaoInimiga.posicoesAtingidas}</p>
					</div>
				</div>
			) : (
				responses.map((response, index) => (
					<div key={index}>
						<pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
							{">"} {response.type}: {JSON.stringify(response.data, null, 2)}
						</pre>
					</div>
				))
			)}
		</div>
	);
};

export default Console;
