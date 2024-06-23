"use client";

import { useGlobalContext } from "@/app/workouts/workout-builder/_context/global-context";
import { api } from "@/trpc/react";
import { levelOptions } from "@/utils";
import { Group, MultiSelect, TextInput, Tooltip } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { UserViewWorkoutCard } from "./UserViewWorkoutCard";

export const UserViewWorkoutCardContainer = () => {
  const { setIsBackdropOpen } = useGlobalContext();

  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<number[]>([]);

  const searchRef = useRef<string>("");
  const {
    data: workouts,
    isLoading,
    refetch,
  } = api.workout.getWorkouts.useQuery(
    {
      search,
      levelOptions: levels,
    },
    {
      refetchOnWindowFocus: true,
    },
  );

  const handleSearch = () => {
    setSearch(searchRef.current);
  };

  const handleRefetchWorkouts = () => {
    void refetch();
  };

  useEffect(() => {
    setIsBackdropOpen(isLoading);
  }, [isLoading, setIsBackdropOpen]);

  return (
    <>
      <Group align="center" mb="md">
        <Tooltip label="Nhấn vào biểu tượng kính lúp hoặc phím Enter để tìm kiếm">
          <TextInput
            placeholder="Tìm kiếm theo tên"
            rightSection={
              <IconSearch
                size={20}
                onClick={handleSearch}
                className="cursor-pointer text-primary transition-all duration-300 ease-out hover:scale-125"
              />
            }
            onKeyDown={(e) => {
              if (e.code === "Enter") return setSearch(searchRef.current);
            }}
            radius="md"
            onChange={(e) => (searchRef.current = e.target.value)}
            w={250}
            size="md"
          />
        </Tooltip>
        <MultiSelect
          radius="md"
          placeholder="Độ khó"
          data={levelOptions}
          clearable
          searchable
          hidePickedOptions
          size="md"
          onChange={(levels) => {
            setLevels(levels.map((l) => Number(l)));
          }}
        />
      </Group>
      <div className="grid grid-cols-12 gap-2 @container">
        {workouts?.map((workout) => (
          <UserViewWorkoutCard
            key={workout.id}
            workout={workout}
            refetchWorkout={handleRefetchWorkouts}
            className="col-span-12 h-full @4xl:col-span-6 @6xl:col-span-4 @[110rem]:col-span-3"
          />
        ))}
      </div>
    </>
  );
};
