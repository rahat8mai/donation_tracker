import { useState } from "react";
import { Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdmin } from "@/contexts/AdminContext";

const AdminLoginDialog = () => {
  const { isAdmin, login, logout } = useAdmin();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(password);
    setIsLoading(false);
    if (success) {
      setPassword("");
      setIsOpen(false);
    }
  };

  if (isAdmin) {
    return (
      <Button variant="outline" size="sm" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        লগআউট
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Lock className="mr-2 h-4 w-4" />
          এডমিন লগইন
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>এডমিন লগইন</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="এডমিন পাসওয়ার্ড লিখুন"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "যাচাই হচ্ছে..." : "লগইন করুন"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
