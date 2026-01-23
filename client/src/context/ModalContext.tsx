import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface ModalContextType {
  isLoginOpen: boolean;
  loginType: "User" | "Shelter";
  openLogin: (type?: "User" | "Shelter") => void;
  closeLogin: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<"User" | "Shelter">("User");

  const openLogin = (type: "User" | "Shelter" = "User") => {
    setLoginType(type);
    setIsLoginOpen(true);
  };

  const closeLogin = () => setIsLoginOpen(false);

  return (
    <ModalContext.Provider
      value={{ isLoginOpen, loginType, openLogin, closeLogin }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModalContext must be used within ModalProvider");
  return context;
};
