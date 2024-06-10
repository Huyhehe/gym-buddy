"use client";

import { useGlobalContext } from "@/app/workouts/workout-builder/_context/global-context";
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

const initialValues = {
  gender: "1",
  age: 18,
  weight: 50,
  height: 150,
  workoutFrequency: workoutFrequencyOptions[0]?.value,
  workoutTarget: workoutTargetOptions[2]?.value,
};

const CalorieCalculatorPage = () => {
  const { setUserInfo } = useGlobalContext();
  const form = useForm({
    initialValues,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateCaloriesNeed = useCallback(
    debounce((caloriesNeed: number) => {
      setUserInfo((prev) => ({
        ...prev,
        caloriesNeed,
      }));
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
      gender: form.values.gender === "1",
    }).toFixed();
    updateCaloriesNeed(Number(caloriesNeed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <div className="p-4 @container/tools-calories">
      <div className="text-center">
        <h1 className="py-5 text-5xl font-bold text-primary">
          Máy tính Calorie
        </h1>
        <p>
          Máy tính calo có thể được sử dụng để ước tính lượng calo bạn cần tiêu
          thụ mỗi ngày.
        </p>
        <p>
          Máy tính này cũng có thể cung cấp một số hướng dẫn đơn giản nếu bạn
          muốn tăng hoặc giảm cân.
        </p>
        <p>
          Máy tính này sử dụng phương trình Harris-Benedict đã sửa đổi để tính
          toán nhu cầu calo của bạn.
        </p>
      </div>
      <Group className="justify-center gap-4 py-10">
        <CircularSlider
          label="Tuổi"
          progressSize={24}
          trackSize={24}
          min={1}
          max={100}
          dataIndex={initialValues.age - 1}
          key={form.key("age")}
          {...form.getInputProps("age")}
        />
        <CircularSlider
          label="Cân nặng(kg)"
          progressSize={24}
          trackSize={24}
          min={1}
          max={300}
          dataIndex={initialValues.weight - 1}
          key={form.key("weight")}
          {...form.getInputProps("weight")}
        />
        <CircularSlider
          label="Chiều cao(cm)"
          progressSize={24}
          trackSize={24}
          min={1}
          max={220}
          dataIndex={initialValues.height - 1}
          key={form.key("height")}
          {...form.getInputProps("height")}
        />
      </Group>
      <Group className="gap-4 @5xl/tools-calories:px-28">
        <Select
          data={[
            { label: "Nam", value: "1" },
            { label: "Nữ", value: "0" },
          ]}
          allowDeselect={false}
          key={form.key("gender")}
          {...form.getInputProps("gender")}
          className="grow @5xl/tools-calories:grow-0"
        />
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
        Bạn phải nạp vào mỗi ngày{" "}
        <span className="font-bold">
          {calculateCaloriesNeededPerDay({
            age: form.values.age,
            height: form.values.height,
            weight: form.values.weight,
            workoutFrequency: Number(form.values.workoutFrequency),
            workoutTarget: Number(form.values.workoutTarget),
            gender: form.values.gender === "1",
          }).toFixed()}
        </span>{" "}
        Kcal
      </div>
    </div>
  );
};

export default CalorieCalculatorPage;
