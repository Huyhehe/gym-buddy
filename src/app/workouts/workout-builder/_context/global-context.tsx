"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

type TGlobalContext = {
  isBackdropOpen: boolean;
  setIsBackdropOpen: Dispatch<SetStateAction<boolean>>;
};

const GlobalContext = createContext<TGlobalContext>({
  isBackdropOpen: false,
  setIsBackdropOpen: () => null,
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({
  children,
}: PropsWithChildren<object>) => {
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
  const values = {
    isBackdropOpen,
    setIsBackdropOpen,
  };

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};
