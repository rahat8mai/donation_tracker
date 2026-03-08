import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUp, FileText, Trash2, ExternalLink } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

interface ExpensePdfUploadProps {
  pdfs: { name: string; url: string; id: string }[];
  onUploadSuccess: () => void;
}

const ExpensePdfUpload = ({ pdfs, onUploadSuccess }: ExpensePdfUploadProps) => {
  const { isAdmin } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("শুধুমাত্র PDF ফাইল আপলোড করা যাবে");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("ফাইলের সাইজ ১০ এমবি এর বেশি হতে পারবে না");
      return;
    }

    setIsUploading(true);

    const fileExt = file.name.split(".").pop() || "pdf";
    const fileName = `${Date.now()}_${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("expense-pdfs")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("আপলোডে সমস্যা হয়েছে");
      console.error(uploadError);
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("expense-pdfs")
      .getPublicUrl(fileName);

    // Save reference in expenses table
    const { error: insertError } = await supabase.from("expenses").insert({
      title: file.name.replace(".pdf", ""),
      amount: 0,
      pdf_url: urlData.publicUrl,
      category: "পিডিএফ বিবরণী",
    } as any);

    setIsUploading(false);

    if (insertError) {
      toast.error("তথ্য সংরক্ষণে সমস্যা হয়েছে");
      console.error(insertError);
      return;
    }

    toast.success("পিডিএফ সফলভাবে আপলোড হয়েছে");
    e.target.value = "";
    onUploadSuccess();
  };

  const handleDelete = async (pdf: { name: string; url: string; id: string }) => {
    // Extract file name from URL
    const urlParts = pdf.url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    await supabase.storage.from("expense-pdfs").remove([fileName]);
    const { error } = await supabase.from("expenses").delete().eq("id", pdf.id);

    if (error) {
      toast.error("মুছতে সমস্যা হয়েছে");
    } else {
      toast.success("সফলভাবে মুছে ফেলা হয়েছে");
      onUploadSuccess();
    }
  };

  return (
    <div className="space-y-4">
      {pdfs.length > 0 && (
        <div className="space-y-2">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent"
              onClick={() => window.open(pdf.url, "_blank", "noopener,noreferrer")}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 shrink-0 text-destructive" />
                <span className="text-sm truncate">{pdf.name}</span>
              </div>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pdf);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 p-6 transition-colors hover:border-primary/50">
              <FileUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isUploading ? "আপলোড হচ্ছে..." : "পিডিএফ আপলোড করুন (সর্বোচ্চ ১০ এমবি)"}
              </span>
            </div>
          </Label>
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
};

export default ExpensePdfUpload;
