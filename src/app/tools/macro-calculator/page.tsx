"use client";

import { useGlobalContext } from "@/app/workouts/workout-builder/_context/global-context";
import { calculateMacros } from "@/utils";
import {
  Button,
  Group,
  NumberInput,
  Radio,
  RingProgress,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useMemo } from "react";

const MacroCalculatorPage = () => {
  const { userInfo } = useGlobalContext();

  const form = useForm({
    initialValues: {
      unit: "60/25/15",
      calories: userInfo?.caloriesNeed ?? 2024,
      mealPerDay: 1,
    },
  });

  const nutrientObject = useMemo(
    () =>
      calculateMacros({
        nutrientString: form.values.unit,
        calories: form.values.calories,
        mealPerDay: form.values.mealPerDay,
      }),
    [form.values.unit, form.values.calories, form.values.mealPerDay],
  );
  return (
    <div className="p-4 @container/tools-macro">
      <Stack className="mb-5 text-center" align="center">
        <h1 className="py-5 text-5xl font-bold text-primary">Máy tính Macro</h1>
        <p className="max-w-[700px]">
          Chất dinh dưỡng đa lượng (macro) thường được định nghĩa là ba chất nền
          được cơ thể sử dụng để sản xuất năng lượng. Các chất nền năng lượng đó
          là carbohydrate, chất béo và protein. Cùng nhau, các chất dinh dưỡng
          đa lượng tạo ra tổng lượng calo cho một loại thực phẩm.
        </p>
      </Stack>
      <Group justify="center" className="items-stretch">
        <Stack className="grow rounded-lg border bg-white p-8" align="center">
          <Text className="text-xl font-bold">Chế độ ăn</Text>
          <Radio.Group
            key={form.values.unit}
            {...form.getInputProps("unit")}
            className="[&_label]:radio-label my-auto [&>div]:space-y-3"
          >
            <Radio
              value="60/25/15"
              label="60/25/15/(Nhiều tinh bột/Carb)"
              className="[&_label]:data-[checked=true]:text-primary"
            />
            <Radio
              value="50/30/20"
              label="50/30/20/(Cân đối)"
              className="[&_label]:data-[checked=true]:text-primary"
            />
            <Radio
              value="40/30/30"
              label="40/30/30/(Giảm cân nhẹ)"
              className="[&_label]:data-[checked=true]:text-primary"
            />
            <Radio
              value="25/45/30"
              label="25/45/30/(Ít tinh bột)"
              className="[&_label]:data-[checked=true]:text-primary"
            />
          </Radio.Group>
        </Stack>
        <Stack className="grow rounded-lg border bg-white p-4">
          <NumberInput
            label="Calories"
            key={form.key("calories")}
            {...form.getInputProps("calories")}
            min={1200}
            max={5000}
            decimalScale={0}
          />
          <Button
            component="a"
            href="/tools/calorie-calculator"
            color="var(--color-primary)"
          >
            Tìm lượng năng lượng cần nạp vào hằng ngày của tôi
          </Button>
          <NumberInput
            label="Số bữa ăn trong ngày"
            key={form.key("mealPerDay")}
            {...form.getInputProps("mealPerDay")}
            min={1}
            max={10}
            decimalScale={0}
          />
        </Stack>
        <Group justify="center">
          {Object.entries(nutrientObject).map(([key, value]) => (
            <RingProgress
              key={key}
              sections={[
                { value: Number(value.percent), color: "var(--color-primary)" },
              ]}
              rootColor="white"
              size={300}
              thickness={16}
              roundCaps
              label={
                <Stack gap={0}>
                  <Text
                    c="var(--color-primary)"
                    fw={700}
                    ta="center"
                    className="text-3xl capitalize"
                  >
                    {key}
                  </Text>
                  <Text
                    c="var(--color-primary)"
                    fw={700}
                    ta="center"
                    className="text-xl"
                  >
                    {value.percent}%
                  </Text>
                  <Text ta="center" size="xs">
                    Gam/ngày
                  </Text>
                  <Text ta="center" fw={700}>
                    {value.perDay}
                  </Text>
                  <Text ta="center" size="xs">
                    Gam/bữa
                  </Text>
                  <Text ta="center" fw={700}>
                    {value.perMeal}
                  </Text>
                </Stack>
              }
            />
          ))}
        </Group>
      </Group>
      <Group
        justify="center"
        className="my-10 rounded-lg border-[3px] border-primary bg-white p-5"
      >
        {Object.entries(nutrientObject).map(([key, value]) => (
          <Text key={key} className="text-lg font-bold capitalize text-primary">
            {key}: {value.percent}%
          </Text>
        ))}
      </Group>
    </div>
  );
};

export default MacroCalculatorPage;
