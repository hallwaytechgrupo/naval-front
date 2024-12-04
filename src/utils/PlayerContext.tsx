import React, { createContext, useContext, useState, useEffect } from "react";

interface PlayerContextProps {
  playerId: number | null;
  setPlayerId: (id: number | null) => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

interface PlayerProviderProps {
  children: React.ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const storedPlayerId = localStorage.getItem("playerId");
    if (storedPlayerId) {
      setPlayerId(Number(storedPlayerId));
    }
  }, []);

  return (
    <PlayerContext.Provider value={{ playerId, setPlayerId }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};