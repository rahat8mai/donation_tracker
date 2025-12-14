import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExpenseForm from "@/components/ExpenseForm";
import AdminLoginDialog from "@/components/AdminLoginDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";

interface Expense {
  id: string;
  title: string;
  amount: number;
  description: string | null;
  category: string | null;
  expense_date: string;
  created_at: string;
}

const Expenses = () => {
  const { isAdmin } = useAdmin();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
      console.error(error);
    } else {
      setExpenses(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      toast.error("মুছতে সমস্যা হয়েছে");
    } else {
      toast.success("সফলভাবে মুছে ফেলা হয়েছে");
      fetchExpenses();
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="absolute right-4 top-4">
        <AdminLoginDialog />
      </div>

      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          হোমে ফিরুন
        </Link>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">খরচের তালিকা</CardTitle>
            {isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    নতুন যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন খরচ যোগ করুন</DialogTitle>
                  </DialogHeader>
                  <ExpenseForm
                    onSuccess={() => {
                      setIsDialogOpen(false);
                      fetchExpenses();
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">মোট খরচ</p>
              <p className="text-2xl font-bold text-destructive">
                ৳ {totalAmount.toLocaleString("bn-BD")}
              </p>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground">লোড হচ্ছে...</p>
            ) : expenses.length === 0 ? (
              <p className="text-center text-muted-foreground">
                কোনো তথ্য পাওয়া যায়নি
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">ক্রমিক</TableHead>
                      <TableHead>শিরোনাম</TableHead>
                      <TableHead>ক্যাটেগরি</TableHead>
                      <TableHead>টাকা</TableHead>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>বিবরণ</TableHead>
                      {isAdmin && <TableHead className="w-24"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense, index) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {(index + 1).toLocaleString("bn-BD")}
                        </TableCell>
                        <TableCell>{expense.title}</TableCell>
                        <TableCell className="max-w-[120px] truncate">
                          {expense.category || "-"}
                        </TableCell>
                        <TableCell>
                          ৳ {Number(expense.amount).toLocaleString("bn-BD")}
                        </TableCell>
                        <TableCell>
                          {new Date(expense.expense_date).toLocaleDateString(
                            "bn-BD"
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {expense.description || "-"}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(expense)}
                              >
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(expense.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>তথ্য সম্পাদনা করুন</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            editData={editingExpense}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setEditingExpense(null);
              fetchExpenses();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;