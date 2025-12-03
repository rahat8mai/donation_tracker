import { Wallet, Receipt } from "lucide-react";
import ActionCard from "@/components/ActionCard";
import { toast } from "sonner";

const Index = () => {
  const handleCollectionClick = () => {
    toast.info("সংগ্রহকৃত টাকার তথ্য শীঘ্রই যোগ করা হবে");
  };

  const handleExpenseClick = () => {
    toast.info("খরচের হিসাব শীঘ্রই যোগ করা হবে");
  };

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
          onClick={handleCollectionClick}
        />
        <ActionCard
          icon={Receipt}
          title="খরচের হিসাব দেখতে এখানে ক্লিক করুন"
          onClick={handleExpenseClick}
        />
      </main>
    </div>
  );
};

export default Index;
