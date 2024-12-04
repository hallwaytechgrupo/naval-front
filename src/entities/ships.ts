// utils/ships.ts
import carrierImage from "./../assets/carrier.png";
import battleshipImage from "./../assets/battleship.png";
import cruiserImage from "./../assets/cruiser.png";
import destroyerImage from "./../assets/destroyer.png";
import submarineImage from "./../assets/submarine.png";

export const ships = [
  { name: "Porta-aviões", size: 5, image: carrierImage },
  { name: "De batalha", size: 4, image: battleshipImage },
  { name: "Cruzador", size: 3, image: cruiserImage },
  { name: "Destruidor", size: 2, image: destroyerImage },
  { name: "Submarino", size: 1, image: submarineImage },
];