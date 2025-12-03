import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CollectionFormProps {
  onSuccess: () => void;
}

const CollectionForm = ({ onSuccess }: CollectionFormProps) => {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [collectionDate, setCollectionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donorName.trim() || !amount) {
      toast.error("দাতার নাম ও টাকার পরিমাণ আবশ্যক");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("collections").insert({
      donor_name: donorName.trim(),
      amount: parseFloat(amount),
      description: description.trim() || null,
      collection_date: collectionDate,
    });

    setIsLoading(false);

    if (error) {
      toast.error("সংরক্ষণে সমস্যা হয়েছে");
      console.error(error);
      return;
    }

    toast.success("টাকা সংগ্রহের তথ্য সংরক্ষিত হয়েছে");
    setDonorName("");
    setAmount("");
    setDescription("");
    setCollectionDate(new Date().toISOString().split("T")[0]);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="donorName">দাতার নাম *</Label>
        <Input
          id="donorName"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="দাতার নাম লিখুন"
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
        <Label htmlFor="collectionDate">তারিখ</Label>
        <Input
          id="collectionDate"
          type="date"
          value={collectionDate}
          onChange={(e) => setCollectionDate(e.target.value)}
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

export default CollectionForm;
