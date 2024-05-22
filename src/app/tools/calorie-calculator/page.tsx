"use client";

import {
  calculateCaloriesNeededPerDay,
  workoutFrequencyOptions,
  workoutTargetOptions,
} from "@/utils";
import CircularSlider from "@fseehawer/react-circular-slider";
import { Group, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { useCalorieStorage } from "../_hooks/useCalorieStorage";

const initialValues = {
  age: 18,
  weight: 50,
  height: 150,
  workoutFrequency: workoutFrequencyOptions[0]?.value,
  workoutTarget: workoutTargetOptions[2]?.value,
};

const CalorieCalculatorPage = () => {
  const { setCaloriesNeed } = useCalorieStorage();
  const form = useForm({
    initialValues,
  });

  const updateCaloriesNeed = useCallback(
    debounce((caloriesNeed: number) => {
      setCaloriesNeed(caloriesNeed);
    }, 200),
    [],
  );

  useEffect(() => {
    const caloriesNeed = calculateCaloriesNeededPerDay({
      age: form.values.age,
      height: form.values.height,
      weight: form.values.weight,
      workoutFrequency: Number(form.values.workoutFrequency),
      workoutTarget: Number(form.values.workoutTarget),
      gender: true,
    }).toFixed();
    updateCaloriesNeed(Number(caloriesNeed));
  }, [form.values]);

  return (
    <div className="p-28">
      <div className="text-center">
        <h1 className="py-5 text-5xl font-bold text-primary">
          Calorie Calculator
        </h1>
        <p>
          The Calorie Calculator can be used to estimate the calories you need
          to consume each day.
        </p>
        <p>
          This calculator can also provide some simple guidelines if you want to
          gain or lose weight.
        </p>
        <p>
          This calculator uses the Revised Harris-Benedict equation to calculate
          your calorie needs.
        </p>
      </div>
      <Group className="justify-center gap-4 py-10">
        <CircularSlider
          label="Age"
          progressSize={24}
          trackSize={24}
          min={1}
          max={100}
          dataIndex={initialValues.age - 1}
          key={form.key("age")}
          {...form.getInputProps("age")}
        />
        <CircularSlider
          label="Weight(kg)"
          progressSize={24}
          trackSize={24}
          min={1}
          max={300}
          dataIndex={initialValues.weight - 1}
          key={form.key("weight")}
          {...form.getInputProps("weight")}
        />
        <CircularSlider
          label="Height(cm)"
          progressSize={24}
          trackSize={24}
          min={1}
          max={220}
          dataIndex={initialValues.height - 1}
          key={form.key("height")}
          {...form.getInputProps("height")}
        />
      </Group>
      <Group className="gap-4">
        <Select
          data={workoutFrequencyOptions}
          allowDeselect={false}
          key={form.key("workoutFrequency")}
          {...form.getInputProps("workoutFrequency")}
          className="grow"
        />
        <Select
          data={workoutTargetOptions}
          allowDeselect={false}
          key={form.key("workoutTarget")}
          {...form.getInputProps("workoutTarget")}
          className="grow"
        />
      </Group>

      <div className="py-2 text-center text-xl">
        You would have to consume{" "}
        <span>
          {calculateCaloriesNeededPerDay({
            age: form.values.age,
            height: form.values.height,
            weight: form.values.weight,
            workoutFrequency: Number(form.values.workoutFrequency),
            workoutTarget: Number(form.values.workoutTarget),
            gender: true,
          }).toFixed()}
        </span>
      </div>
    </div>
  );
};

export default CalorieCalculatorPage;
