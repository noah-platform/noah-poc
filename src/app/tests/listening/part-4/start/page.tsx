import { generateListeningTest } from "@/common/listening";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Questions } from "../../../../../common/components/Questionset";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
  const { audioscript, questionset } = await generateListeningTest(searchParams.scenario);

  return (
    <ResizablePanelGroup className="gap-2 p-6 w-full h-full" direction="horizontal">
      <ResizablePanel defaultSize={3} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>You will hear...</Label>
          <Textarea defaultValue={searchParams.scenario} readOnly />
        </div>
        <div className="flex flex-col gap-2 h-full">
          <Label>Audio</Label>
          <audio className="w-full" controls>
            <source src="horse.ogg" type="audio/ogg" />
          </audio>
          <Accordion type="single" collapsible>
            <AccordionItem className="border-none" value="audioscript">
              <AccordionTrigger className="text-sm">Audioscript</AccordionTrigger>
              <AccordionContent className="h-full">
                <Textarea className="min-h-[500px]" defaultValue={audioscript} readOnly />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ResizablePanel>
      <ResizableHandle className="mx-4" withHandle />
      <ResizablePanel defaultSize={5} className="flex flex-col gap-4 h-full w-full">
        <Questions questionset={questionset[0]} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
