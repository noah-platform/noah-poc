"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { match } from "ts-pattern";

export default function Home() {
  const router = useRouter();

  const [selectedSkill, setSelectedSkill] = useQueryState("skill", { defaultValue: "" });
  const [selectedPart, setSelectedPart] = useQueryState("part", { defaultValue: "" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/tests/${selectedSkill}/${selectedPart}`);
  };

  return (
    <main className="flex flex-col justify-center items-center gap-6 min-h-svh">
      <h1 className="text-2xl font-bold">Noah POC</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[340px]">
        <div className="flex flex-col gap-2">
          <Label>Skill</Label>
          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger>
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="listening">Listening</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedSkill !== "" && (
          <div className="flex flex-col gap-2">
            <Label>Part</Label>
            <Select value={selectedPart} onValueChange={setSelectedPart}>
              <SelectTrigger>
                <SelectValue placeholder="Part" />
              </SelectTrigger>
              {match(selectedSkill)
                .with("listening", () => (
                  <SelectContent>
                    <SelectItem value="part-2">Part 2 (Daily-life Monologue)</SelectItem>
                    <SelectItem value="part-4">Part 4 (Academic Monologue)</SelectItem>
                  </SelectContent>
                ))
                .with("writing", () => (
                  <SelectContent>
                    <SelectItem value="task-1">Task 1</SelectItem>
                  </SelectContent>
                ))
                .run()}
            </Select>
          </div>
        )}

        <Button disabled={!selectedSkill || !selectedPart}>Go</Button>
      </form>
    </main>
  );
}
