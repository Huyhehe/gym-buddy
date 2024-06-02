"use client";

import { useDisclosure } from "@mantine/hooks";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";
import { boolean } from "zod";

type TGlobalContext = {
  isBackdropOpen: boolean;
  setIsBackdropOpen: Dispatch<SetStateAction<boolean>>;
  loginModalOpened: boolean;
  loginModalClose: () => void;
  loginModalOpen: () => void;
  isMale: boolean;
  setMale: () => void;
  setFemale: () => void;
  toggleGender: () => void;
};

const GlobalContext = createContext<TGlobalContext>({
  isBackdropOpen: false,
  setIsBackdropOpen: () => null,
  loginModalOpened: false,
  loginModalClose: () => null,
  loginModalOpen: () => null,
  isMale: false,
  setMale: () => null,
  setFemale: () => null,
  toggleGender: () => null,
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({
  children,
}: PropsWithChildren<object>) => {
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
  const [loginModalOpened, { close: loginModalClose, open: loginModalOpen }] =
    useDisclosure();
  const [isMale, { toggle: toggleGender, close: setFemale, open: setMale }] =
    useDisclosure(true);
  const values = {
    isBackdropOpen,
    setIsBackdropOpen,
    loginModalOpened,
    loginModalClose,
    loginModalOpen,
    isMale,
    setMale,
    setFemale,
    toggleGender,
  };

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};
