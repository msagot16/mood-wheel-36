import { useState, useCallback } from "react";

export interface Evaluation {
  id: string;
  placeName: string;
  outerCharacteristic: string;
  innerCharacteristic: string;
  timestamp: string;
}

export const useEvaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const saveEvaluation = useCallback((evaluation: Omit<Evaluation, 'id'>) => {
    const newEvaluation: Evaluation = {
      ...evaluation,
      id: Date.now().toString(),
    };
    
    setEvaluations(prev => [newEvaluation, ...prev]);
    return newEvaluation;
  }, []);

  const deleteEvaluation = useCallback((id: string) => {
    setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
  }, []);

  return {
    evaluations,
    saveEvaluation,
    deleteEvaluation,
  };
};