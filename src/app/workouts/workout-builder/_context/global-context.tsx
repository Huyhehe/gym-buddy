"use client";

import { UserReturnType } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

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
  userInfo: TUserInfo | null;
  setUserInfo: Dispatch<SetStateAction<TUserInfo | null>>;
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
  userInfo: {
    age: 18,
    caloriesNeed: 1200,
    height: 150,
    weight: 50,
  },
  setUserInfo: () => null,
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

type TUserInfo = Partial<
  Pick<UserReturnType, "age" | "caloriesNeed" | "weight" | "height">
> | null;

type TGlobalContextProvider = {
  userInfo: TUserInfo;
};

export const GlobalContextProvider = ({
  children,
  userInfo: baseUserInfo = {
    age: 18,
    caloriesNeed: 1200,
    height: 150,
    weight: 50,
  },
}: PropsWithChildren<TGlobalContextProvider>) => {
  const [userInfo, setUserInfo] = useState(baseUserInfo);
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
    userInfo,
    setUserInfo,
  };

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};
