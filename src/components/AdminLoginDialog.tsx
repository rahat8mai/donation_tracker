import { useState } from "react";
import { Lock, LogOut, Mail } from "lucide-react";
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
  const { isAdmin, user, login, signup, logout, isLoading: contextLoading } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    let success: boolean;
    if (isSignup) {
      success = await signup(email, password);
    } else {
      success = await login(email, password);
    }
    
    setIsLoading(false);
    if (success && !isSignup) {
      setEmail("");
      setPassword("");
      setIsOpen(false);
    }
  };

  if (contextLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Lock className="mr-2 h-4 w-4" />
        লোড হচ্ছে...
      </Button>
    );
  }

  if (isAdmin && user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {user.email}
        </span>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          লগআউট
        </Button>
      </div>
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
          <DialogTitle>{isSignup ? "রেজিস্ট্রেশন" : "এডমিন লগইন"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">ইমেইল</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="pl-10"
                minLength={6}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "যাচাই হচ্ছে..." : isSignup ? "রেজিস্ট্রেশন করুন" : "লগইন করুন"}
          </Button>
        </form>
        <div className="text-center text-sm">
          {isSignup ? (
            <p>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="text-primary underline"
              >
                লগইন করুন
              </button>
            </p>
          ) : (
            <p>
              অ্যাকাউন্ট নেই?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="text-primary underline"
              >
                রেজিস্ট্রেশন করুন
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
