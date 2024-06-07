import { api } from "@/trpc/server";
import { HistoryContainer } from "./_components/HistoryContainer";

const HistoryPage = async () => {
  try {
    const user = await api.user.getMe();
    if (user.id) {
      return (
        <div className="p-6">
          <HistoryContainer />
        </div>
      );
    }
    return <div className="p-6">{`You don't exist`}</div>;
  } catch (error) {
    return <div className="p-6">somethings went wrong</div>;
  }
};

export default HistoryPage;
