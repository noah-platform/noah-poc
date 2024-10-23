/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import reactStringReplace from "react-string-replace";
import parse from "html-react-parser";
import { Input } from "@/components/ui/input";

export function Questions({ questionset }: any) {
  return (
    <div className="prose min-w-full p-4">
      <h3>{questionset.title}</h3>
      <h4>{questionset.instruction}</h4>
      {questionset.type === "matching" && (
        <>
          <h4>{questionset.question}</h4>
          <div>
            <strong>{questionset.labels.options}</strong>
            {questionset.options.map((option: any) => (
              <p key={option.choice}>
                {option.choice}. {option.text}
              </p>
            ))}
            <strong>{questionset.labels.questions}</strong>
          </div>
        </>
      )}
      {(questionset.questions || []).map((question: any) => (
        <div key={JSON.stringify(question)}>
          {questionset.type === "single" && (
            <div>
              <p>{question.question}</p>
              {question.options.map((option: any) => (
                <div key={option.choice}>
                  <input type="radio" key={option.choice} />
                  <label>
                    {option.choice}. {option.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          {questionset.type === "multiple" && (
            <div>
              <p>{question.question}</p>
              {question.options.map((option: any) => (
                <div key={option.choice}>
                  <input type="checkbox" key={option.choice} />
                  <label>
                    {option.choice}. {option.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          {questionset.type === "matching" && <p>{question.question}</p>}
          {questionset.type === "completion" && (
            <div>
              {parse(question.question, {
                replace: (domNode) => {
                  if (domNode.type === "text") {
                    return (
                      <>
                        {reactStringReplace(domNode.data, /{{(\d+)}}/g, (match) => (
                          <Input className="inline-block w-[200px] mx-1" key={match} />
                        ))}
                      </>
                    );
                  }
                },
              })}
            </div>
          )}
          {/* <h3>Answers</h3>
          <pre>{JSON.stringify(question.answer, null, 2)}</pre> */}
        </div>
      ))}
    </div>
  );
}
