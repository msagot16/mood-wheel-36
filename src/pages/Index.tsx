import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { EvaluationPage } from "@/components/EvaluationPage";
import { HistoryPage } from "@/components/HistoryPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"evaluation" | "history">("evaluation");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === "evaluation" ? <EvaluationPage /> : <HistoryPage />}
      </div>
    </div>
  );
};

export default Index;
