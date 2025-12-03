import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  onClick?: () => void;
  className?: string;
}

const ActionCard = ({ icon: Icon, title, onClick, className }: ActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full max-w-md rounded-lg border border-border bg-card p-6 text-left transition-all duration-300",
        "hover:border-primary/50 hover:bg-secondary hover:shadow-lg hover:shadow-primary/10",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-7 w-7" />
        </div>
        <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
          {title}
        </p>
      </div>
    </button>
  );
};

export default ActionCard;
