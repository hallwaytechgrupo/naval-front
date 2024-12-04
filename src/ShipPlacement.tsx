import { useEffect, useState } from "react";
import { ships } from "./entities/ships";

interface ShipPlacementProps {
	onShipSelected: (
		ship: { name: string; size: number },
		orientation: "horizontal" | "vertical",
	) => void;
}

const ShipPlacement: React.FC<ShipPlacementProps> = ({ onShipSelected }) => {
	const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
		"horizontal",
	);
	const [selectedShip, setSelectedShip] = useState<{
		name: string;
		size: number;
	}>({ name: "Carrier", size: 5 });

	const handleShipSelection = (ship: { name: string; size: number }) => {
		setSelectedShip(ship);
		onShipSelected(ship, orientation);
	};

	useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'H' || event.key === 'h') {
        setOrientation('horizontal');
				onShipSelected(selectedShip, 'horizontal');
      } else if (event.key === 'V' || event.key === 'v') {
        setOrientation('vertical');
				onShipSelected(selectedShip, 'vertical');
      } else if (['1', '2', '3', '4', '5'].includes(event.key)) {
		const shipIndex = Number(event.key) - 1;
		if (shipIndex >= 0 && shipIndex < ships.length) {
		  setSelectedShip(ships[shipIndex]);
		  onShipSelected(ships[shipIndex], orientation);
		}
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

	return (
		<div
			className="bg-gray-800 text-white p-4 mt-4 rounded-lg"
			style={{
				backgroundColor: "rgba(31, 41, 55, 0.8)",
				backdropFilter: "blur(10px)",
			}}
		>
			<h2 className="text-xl font-bold mb-2">Posicionamento de Navios</h2>
			<div className="mb-4 p-3 border border-[#4B5563] rounded-lg">
				<label className="block mb-2">Orientação:</label>
				<div className="flex justify-center space-x-4">
					<div
						className={`px-5 py-3 bg-gray-700 rounded-lg cursor-pointer ${
							orientation === "horizontal" ? "border-2 border-blue-500" : ""
						}`}
						onClick={() => {
							setOrientation("horizontal");
							onShipSelected(selectedShip, "horizontal");
						}}
					>
						<div className="text-lg font-bold">Horizontal</div>
					</div>
					<div
						className={`px-5 py-3 bg-gray-700 rounded-lg cursor-pointer ${
							orientation === "vertical" ? "border-2 border-blue-500" : ""
						}`}
						onClick={() => {
							setOrientation("vertical");
							onShipSelected(selectedShip, "vertical");
						}}
					>
						<div className="text-lg font-bold">Vertical</div>
					</div>
				</div>
			</div>
			<div className="p-3 border border-[#4B5563] rounded-lg">
				<label className="block mb-2">Selecione o Navio:</label>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
					{ships.map((ship) => (
						<div
							key={ship.name}
							className={`p-2 bg-gray-700 rounded-lg cursor-pointer ${
								selectedShip.name === ship.name
									? "border-2 border-blue-500"
									: ""
							} text-center flex flex-col sm:flex-row items-center`}
							onClick={() => handleShipSelection(ship)}
						>
							<img
								src={ship.image}
								alt={ship.name}
								className="w-full sm:w-1/3 h-10 sm:h-16 object-contain mb-2 sm:mb-0"
							/>
							<div className="sm:ml-4">
								<div className="text-lg font-bold">{ship.name}</div>
								<div className="text-sm">Tamanho: {ship.size}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ShipPlacement;
