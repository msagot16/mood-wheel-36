import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEvaluations } from "@/hooks/useEvaluations";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const HistoryPage = () => {
  const { evaluations, deleteEvaluation } = useEvaluations();

  const handleDelete = (id: string, placeName: string) => {
    deleteEvaluation(id);
    toast.success(`Deleted evaluation for ${placeName}`);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (evaluations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-card rounded-2xl p-12 premium-shadow">
          <h2 className="text-2xl font-semibold mb-4">No Evaluations Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start evaluating spaces to see your history here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 luxurious-spacing">
          Evaluation History
        </h1>
        <p className="text-lg text-muted-foreground">
          Your saved space evaluations ({evaluations.length} total)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} className="p-6 premium-shadow dial-smooth hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold truncate flex-1 mr-2">
                {evaluation.placeName}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(evaluation.id, evaluation.placeName)}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Emotional:</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full bg-${evaluation.outerCharacteristic}/20 text-${evaluation.outerCharacteristic}`}>
                  {evaluation.outerCharacteristic.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Activity:</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full bg-${evaluation.innerCharacteristic}/20 text-${evaluation.innerCharacteristic}`}>
                  {evaluation.innerCharacteristic.toUpperCase()}
                </span>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {formatDate(evaluation.timestamp)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};