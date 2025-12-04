import { useEffect, useState } from "react";
import { Wallet, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActionCard from "@/components/ActionCard";
import AdminLoginDialog from "@/components/AdminLoginDialog";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
const Index = () => {
  const navigate = useNavigate();
  const {
    isAdmin
  } = useAdmin();
  const [totalCollection, setTotalCollection] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchTotals = async () => {
      const [collectionsRes, expensesRes] = await Promise.all([supabase.from("collections").select("amount"), supabase.from("expenses").select("amount")]);
      const collectionTotal = (collectionsRes.data || []).reduce((sum, item) => sum + Number(item.amount), 0);
      const expenseTotal = (expensesRes.data || []).reduce((sum, item) => sum + Number(item.amount), 0);
      setTotalCollection(collectionTotal);
      setTotalExpense(expenseTotal);
      setIsLoading(false);
    };
    fetchTotals();
  }, []);
  const balance = totalCollection - totalExpense;
  return <div className="flex min-h-screen flex-col items-center bg-background px-4 py-12 sm:py-16">
      <div className="absolute right-4 top-4">
        <AdminLoginDialog />
      </div>

      <header className="mb-8 text-center sm:mb-12">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          সংগ্রহকৃত টাকার হিসাব 
        </h1>
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-primary/60" />
        {isAdmin && <p className="mt-2 text-sm text-primary">এডমিন মোড সক্রিয়</p>}
      </header>

      {/* Summary Cards */}
      <div className="mb-8 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">মোট সংগ্রহ</p>
            <p className="text-xl font-bold text-primary sm:text-2xl">
              {isLoading ? "..." : `৳ ${totalCollection.toLocaleString("bn-BD")}`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">মোট খরচ</p>
            <p className="text-xl font-bold text-destructive sm:text-2xl">
              {isLoading ? "..." : `৳ ${totalExpense.toLocaleString("bn-BD")}`}
            </p>
          </CardContent>
        </Card>
        <Card className={`${balance >= 0 ? "border-green-500/20 bg-green-500/5" : "border-destructive/20 bg-destructive/5"}`}>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">অবশিষ্ট</p>
            <p className={`text-xl font-bold sm:text-2xl ${balance >= 0 ? "text-green-500" : "text-destructive"}`}>
              {isLoading ? "..." : `৳ ${balance.toLocaleString("bn-BD")}`}
            </p>
          </CardContent>
        </Card>
      </div>

      <main className="flex w-full max-w-2xl flex-col items-center gap-6">
        <ActionCard icon={Wallet} title="এখন পর্যন্ত সংগ্রহকৃত টাকার পরিমাণ জানতে এখানে ক্লিক করুন" onClick={() => navigate("/collections")} />
        <ActionCard icon={Receipt} title="খরচের হিসাব দেখতে এখানে ক্লিক করুন" onClick={() => navigate("/expenses")} />
      </main>
    </div>;
};
export default Index;