"use client";

import { Button, Group, NumberInput, Slider } from "@mantine/core";
import { useWorkoutBuilderFormContext } from "../_context";

export const AgeSelector = () => {
  const { values, setFieldValue, getInputProps, key } =
    useWorkoutBuilderFormContext();

  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-primary">Tuổi tác</h1>
      <div className="justify-center px-[20%]">
        <div className="space-y-6 border bg-white p-10 shadow-md">
          <Group>
            <h1 className="text-3xl font-bold">Tuổi</h1>
            <NumberInput
              min={13}
              max={100}
              key={key("age")}
              {...getInputProps("age")}
              className="w-fit"
            />
          </Group>
          <Slider
            min={13}
            max={100}
            color="var(--color-primary)"
            key={key("age")}
            {...getInputProps("age")}
          />
        </div>
        <Group justify="center" mt="xl">
          <Button
            color="gray"
            className="box-content px-8 py-1 text-xl"
            onClick={() => setFieldValue("currentStep", values.currentStep - 1)}
          >
            Quay lại
          </Button>
          <Button
            color="var(--color-primary)"
            className="box-content px-8 py-1 text-xl"
            onClick={() => setFieldValue("currentStep", values.currentStep + 1)}
          >
            Tiếp theo
          </Button>
        </Group>
      </div>
    </>
  );
};
