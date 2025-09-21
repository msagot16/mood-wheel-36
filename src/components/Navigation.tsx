import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: "evaluation" | "history";
  onTabChange: (tab: "evaluation" | "history") => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="flex justify-center mb-4">
      <div className="bg-card rounded-full p-2 premium-shadow">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "evaluation" ? "default" : "ghost"}
            size="lg"
            onClick={() => onTabChange("evaluation")}
            className={cn(
              "rounded-full px-8 luxurious-spacing font-medium dial-smooth",
              activeTab === "evaluation" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Evaluation
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="lg"
            onClick={() => onTabChange("history")}
            className={cn(
              "rounded-full px-8 luxurious-spacing font-medium dial-smooth",
              activeTab === "history" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            History
          </Button>
        </div>
      </div>
    </nav>
  );
};