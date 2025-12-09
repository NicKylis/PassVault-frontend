import { useState } from "react";
import SecurityStatistics from "@/components/SecurityStatistics";
import PasswordCard from "@/components/PasswordCard";
import WhatsNew from "@/components/WhatsNew";
import { usePasswords } from "@/context/PasswordContext";
import { Button } from "@/components/ui/button";
import { NewPasswordModal } from "@/components/NewPasswordModal";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { passwords } = usePasswords();
  const user = useAuth().user;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recentlyUsed = [...passwords]
    .filter((p) => p.lastUsedAt)
    .sort(
      (a, b) =>
        new Date(b.lastUsedAt!).getTime() - new Date(a.lastUsedAt!).getTime()
    )
    .slice(0, 3);

  return (
    <div className="flex-1 pt-4 px-3 md:px-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-3xl sm:text-4xl font-semibold">
          Welcome, {user?.name}
        </h1>
        <Button
          className="bg-primary hover:primary-hover w-full sm:w-auto text-white"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add New Password
        </Button>
      </div>

      <NewPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        <SecurityStatistics />
        <WhatsNew />
      </div>

      <h1 className="text-xl sm:text-2xl">Recently Used</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {recentlyUsed.length > 0 ? (
          recentlyUsed.map((item) => <PasswordCard key={item.id} {...item} />)
        ) : (
          <p className="text-gray-500">No recent activity yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
