import { Wallet, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActionCard from "@/components/ActionCard";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-12 sm:py-16">
      <header className="mb-12 text-center sm:mb-16">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          সংগ্রহকৃত টাকার হিসাব নিকাশ
        </h1>
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-primary/60" />
      </header>

      <main className="flex w-full max-w-2xl flex-col items-center gap-6">
        <ActionCard
          icon={Wallet}
          title="এখন পর্যন্ত সংগ্রহকৃত টাকার পরিমাণ জানতে এখানে ক্লিক করুন"
          onClick={() => navigate("/collections")}
        />
        <ActionCard
          icon={Receipt}
          title="খরচের হিসাব দেখতে এখানে ক্লিক করুন"
          onClick={() => navigate("/expenses")}
        />
      </main>
    </div>
  );
};

export default Index;
