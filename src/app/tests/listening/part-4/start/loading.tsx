"use client";

import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  return (
    <main className="flex flex-col justify-center items-center gap-2 h-dvh">
      <h1 className="font-bold text-lg">You are about to hear...</h1>
      <h2>{searchParams.get("scenario")}</h2>
      <h3 className="text-sm text-center my-2">
        Exam and audio generation is being performed in the background.
        <br />
        Please wait patiently and do not refresh the page as duplicate costs will be incurred.
        <br />
        It may take up to 3-5 minutes.
      </h3>
    </main>
  );
}
