"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { generateListeningPart4Scenario } from "../../../../common/listening";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useQueryState("scenario", { defaultValue: "" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/tests/listening/part-4/start?scenario=${encodeURIComponent(scenario)}`);
  };

  const handleGenerateScenario = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    const scenario = await generateListeningPart4Scenario();
    setScenario(scenario);
    setLoading(false);
  };

  return (
    <main className="flex flex-col justify-center items-center gap-6 min-h-svh">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[480px]">
        <Label>You will here...</Label>
        <Textarea value={scenario} onChange={(event) => setScenario(event.target.value)} />
        <Button onClick={handleGenerateScenario} variant="outline" disabled={loading}>
          Generate
        </Button>
        <Button>Go</Button>
      </form>
      <Button onClick={router.back} variant="link">
        Back
      </Button>
    </main>
  );
}
