import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExpenseFormProps {
  onSuccess: () => void;
}

const ExpenseForm = ({ onSuccess }: ExpenseFormProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !amount) {
      toast.error("খরচের শিরোনাম ও টাকার পরিমাণ আবশ্যক");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("expenses").insert({
      title: title.trim(),
      amount: parseFloat(amount),
      description: description.trim() || null,
      expense_date: expenseDate,
    });

    setIsLoading(false);

    if (error) {
      toast.error("সংরক্ষণে সমস্যা হয়েছে");
      console.error(error);
      return;
    }

    toast.success("খরচের তথ্য সংরক্ষিত হয়েছে");
    setTitle("");
    setAmount("");
    setDescription("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">খরচের শিরোনাম *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="খরচের শিরোনাম লিখুন"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">টাকার পরিমাণ *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="টাকার পরিমাণ লিখুন"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expenseDate">তারিখ</Label>
        <Input
          id="expenseDate"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="অতিরিক্ত তথ্য লিখুন"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
      </Button>
    </form>
  );
};

export default ExpenseForm;
