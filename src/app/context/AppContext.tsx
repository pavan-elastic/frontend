"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("");

  return (
    <AppContext.Provider value={{ name, setName }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
