import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DualDial } from "./DualDial";
import { useEvaluations } from "@/hooks/useEvaluations";
import { toast } from "sonner";

export const EvaluationPage = () => {
  const [placeName, setPlaceName] = useState("");
  const [currentEvaluation, setCurrentEvaluation] = useState({ outer: "relaxing", inner: "active" });

  const handleEvaluationChange = (outer: string, inner: string) => {
    setCurrentEvaluation({ outer, inner });
  };

  const { saveEvaluation } = useEvaluations();

  const handleSave = () => {
    if (!placeName.trim()) {
      toast.error("Please enter a place name");
      return;
    }

    const evaluation = {
      placeName: placeName.trim(),
      outerCharacteristic: currentEvaluation.outer,
      innerCharacteristic: currentEvaluation.inner,
      timestamp: new Date().toISOString(),
    };
    
    saveEvaluation(evaluation);
    
    toast.success(`Evaluation saved for ${placeName}`, {
      description: `${currentEvaluation.outer} • ${currentEvaluation.inner}`,
    });
    
    setPlaceName("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold mb-1 luxurious-spacing">
          Space Evaluation
        </h1>
        <p className="text-sm text-muted-foreground mb-2 max-w-2xl mx-auto leading-relaxed">
          Evaluate spaces through dual dimensions of valence and arousal. 
          Rotate the dials to describe your cognitive state.
        </p>
      </div>

      {/* Dual Dial Interface */}
      <div className="mb-2">
        <DualDial onEvaluationChange={handleEvaluationChange} />
      </div>

      {/* Current Evaluation Display */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center space-x-4 bg-card rounded-full px-4 py-2 premium-shadow">
          <span className="text-sm text-muted-foreground">Current:</span>
          <span className="text-sm font-medium text-primary">
            {currentEvaluation.outer.toUpperCase()}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm font-medium text-primary">
            {currentEvaluation.inner.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Save Evaluation */}
      <div className="bg-card rounded-2xl p-3 premium-shadow max-w-md mx-auto">
        <h3 className="text-base font-semibold mb-2 text-center">Save Evaluation</h3>
        <div className="space-y-2">
          <Input
            placeholder="Enter place name..."
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            className="rounded-full px-4 py-2 text-center luxurious-spacing"
            onKeyPress={(e) => e.key === "Enter" && handleSave()}
          />
          <Button
            onClick={handleSave}
            className="w-full rounded-full py-2 luxurious-spacing font-medium dial-smooth"
            size="lg"
          >
            Save Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
};
