import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { ScannerPage } from "./scanner-page";
import { ScanningAnimation } from "./scanning-animation";
import { ResultsPage } from "./results-page";
import { DRAGONFLY_SPECIES } from "./dragonfly-data";
import { useUser } from "./user-context";

export function ScanFlow() {
  const navigate = useNavigate();
  const { addXp, discoverSpecies, user } = useUser();
  const [state, setState] = useState<
    | { step: "select" }
    | { step: "scanning"; speciesId: string; imageUrl: string }
    | { step: "results"; speciesId: string; imageUrl: string }
  >({ step: "select" });

  const handleScan = useCallback((speciesId: string, imageUrl: string) => {
    setState({ step: "scanning", speciesId, imageUrl });
  }, []);

  const handleScanComplete = useCallback(() => {
    if (state.step === "scanning") {
      setState({ step: "results", speciesId: state.speciesId, imageUrl: state.imageUrl });
      if (user.isLoggedIn) {
        const species = DRAGONFLY_SPECIES.find((s) => s.id === state.speciesId);
        addXp(50, "Escaneo completado");
        discoverSpecies(state.speciesId, species?.commonName);
      }
    }
  }, [state, addXp, discoverSpecies, user.isLoggedIn]);

  const handleScanAgain = useCallback(() => {
    setState({ step: "select" });
  }, []);

  if (state.step === "scanning") {
    return <ScanningAnimation imageUrl={state.imageUrl} onComplete={handleScanComplete} />;
  }

  if (state.step === "results") {
    const species = DRAGONFLY_SPECIES.find((s) => s.id === state.speciesId);
    if (!species) return null;
    return <ResultsPage species={species} scannedImage={state.imageUrl} onScanAgain={handleScanAgain} />;
  }

  return <ScannerPage onScan={handleScan} />;
}
