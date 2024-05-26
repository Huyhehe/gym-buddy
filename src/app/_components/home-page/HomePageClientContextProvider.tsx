"use client";

import type { EquipmentReturnType } from "@/types";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";

import { createContext, useContext, useState } from "react";

type THomePageClientContext = {
  equipments: EquipmentReturnType[];
  equipment: string;
  setEquipment: Dispatch<SetStateAction<string>>;
};

const HomePageClientContext = createContext<THomePageClientContext>({
  equipments: [],
  equipment: "0",
  setEquipment: () => null,
});

export const useHomePageClientContext = () => useContext(HomePageClientContext);

type Props = {
  equipments: EquipmentReturnType[];
};

export const HomePageClientContextProvider = ({
  children,
  equipments,
}: PropsWithChildren<Props>) => {
  const [equipment, setEquipment] = useState("0");
  const values = {
    equipments,
    equipment,
    setEquipment,
  };

  return (
    <HomePageClientContext.Provider value={values}>
      {children}
    </HomePageClientContext.Provider>
  );
};
