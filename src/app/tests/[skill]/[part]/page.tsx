import { notFound } from "next/navigation";
import ListeningPart4 from "./components/listening/part-4";
import { match } from "ts-pattern";

export default function TestRoom({ params }: { params: { skill: string; part: string } }) {
  return match({ skill: params.skill, part: params.part })
    .with({ skill: "listening", part: "part-4" }, () => <ListeningPart4 />)
    .otherwise(() => notFound());
}
