import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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
import CollectionForm from "@/components/CollectionForm";
import AdminLoginDialog from "@/components/AdminLoginDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";

interface Collection {
  id: string;
  donor_name: string;
  amount: number;
  description: string | null;
  collection_date: string;
  created_at: string;
}

const Collections = () => {
  const { isAdmin } = useAdmin();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("collection_date", { ascending: false });

    if (error) {
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
      console.error(error);
    } else {
      setCollections(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) {
      toast.error("মুছতে সমস্যা হয়েছে");
    } else {
      toast.success("সফলভাবে মুছে ফেলা হয়েছে");
      fetchCollections();
    }
  };

  const totalAmount = collections.reduce((sum, c) => sum + Number(c.amount), 0);

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
            <CardTitle className="text-xl">সংগ্রহকৃত টাকার তালিকা</CardTitle>
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
                    <DialogTitle>নতুন টাকা সংগ্রহ যোগ করুন</DialogTitle>
                  </DialogHeader>
                  <CollectionForm
                    onSuccess={() => {
                      setIsDialogOpen(false);
                      fetchCollections();
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">মোট সংগ্রহ</p>
              <p className="text-2xl font-bold text-primary">
                ৳ {totalAmount.toLocaleString("bn-BD")}
              </p>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground">লোড হচ্ছে...</p>
            ) : collections.length === 0 ? (
              <p className="text-center text-muted-foreground">
                কোনো তথ্য পাওয়া যায়নি
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>দাতার নাম</TableHead>
                      <TableHead>টাকা</TableHead>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>বিবরণ</TableHead>
                      {isAdmin && <TableHead className="w-12"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell>{collection.donor_name}</TableCell>
                        <TableCell>
                          ৳ {Number(collection.amount).toLocaleString("bn-BD")}
                        </TableCell>
                        <TableCell>
                          {new Date(collection.collection_date).toLocaleDateString(
                            "bn-BD"
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {collection.description || "-"}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(collection.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
    </div>
  );
};

export default Collections;
