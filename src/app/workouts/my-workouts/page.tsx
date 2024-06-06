import { getServerAuthSession } from "@/server/auth";
import { MyWorkoutCardContainer } from "./_components/MyWorkoutCardContainer";

const MyWorkoutPage = async () => {
  return (
    <div className="p-6">
      <MyWorkoutCardContainer />
    </div>
  );
};

export default MyWorkoutPage;
