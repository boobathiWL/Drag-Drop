// GlobalStateContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalStateContextType {
  showTempParent: boolean;
  setShowTempParent: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showTempParent, setShowTempParent] = useState(false);

  return (
    <GlobalStateContext.Provider value={{ showTempParent, setShowTempParent }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
