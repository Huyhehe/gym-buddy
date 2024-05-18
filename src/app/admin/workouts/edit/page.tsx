import { redirect } from "next/navigation";

const page = () => {
  redirect("/admin/workouts");
};

export default page;
