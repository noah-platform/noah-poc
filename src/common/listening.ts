"use server";

import { openai } from "@/common/clients/openai";
import { textToSpeechClient } from "./clients/text-to-speech";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3Client } from "./clients/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function generateListeningPart4Scenario() {
  console.log("Start generating listening part 4 scenario");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Generate a scenario for IELTS listening test part 4, a monologue in an academic context in the following pattern:

                  Example Output:
                    1. a literature student giving a talk about Victor Hugo, a famous 19th century French writer.
                    2. a history student giving part of a presentation about changes in british society in the 19th century.
                    3. part of an environmental science lecture about microplastics.
                    4. a lecturer on a fashion design course introducing the subject of hand knitting which involves making things like woolen jumpers and scarves.
                    5. an anthropology student giving a presentation on spiral path designs known as Labyrinth.
                    
                  Only output a scenario in 1 sentence, beginning with lowercase`,
      },
    ],
    temperature: 1,
  });
  if (response.choices[0].finish_reason !== "stop") {
    throw new Error("Insufficient tokens to complete the task");
  }
  if (!response.choices[0].message.content) {
    throw new Error("No content returned from the model");
  }
  const scenario = response.choices[0].message.content;
  console.info("Scenario generated:", scenario);
  return scenario;
}

const AUDIOSCRIPT =
  'Dancing is something that humans do when they want to have a good time. It’s a universal response to music, found in all cultures. But what’s only been discovered recently is that dancing not only makes us feel good, it’s also extremely good for our health.\\n\\nDancing, like other forms of exercise, releases hormones, such as dopamine, which make us feel relaxed and happy. And it also reduces feelings of stress or anxiety.\\n\\nDancing is also a sociable activity, which is another reason it makes us feel good.\\n\\nOne study compared people’s enjoyment of dancing at home in front of a video with dancing in a group in a studio.\\n\\nThe people dancing in a group reported feeling happier, whereas those dancing alone did not.\\n\\nIn another experiment, university researchers at York and Sheffield took a group of students and sent each of them into a lab where music was played for five minutes. Each had to choose from three options: to sit and listen quietly to the music, to cycle on an exercise bike while they listened, or to get up and dance. All were given cognitive tasks to perform before and after. The result showed that those who chose to dance showed much more creativity when doing problem-solving tasks.\\n\\nDoctor Lovatt at the University of Hertfordshire believes dance could be a very useful way to help people suffering from mental health problems. He thinks dance should be prescribed as therapy to help people overcome issues such as depression.\\n\\n<<BREAK>>\\n\\nIt’s well established that dance is a good way of encouraging adolescent girls to take exercise but what about older people? Studies have shown that there are enormous benefits for people in their sixties and beyond. One of the great things about dance is that there are no barriers to participation. Anyone can have a go, even those whose standard of fitness is quite low.\\n\\nDance can be especially beneficial for older adults who can’t run or do more intense workouts, or for those who don’t want to. One 2015 study found that even a gentle dance workout helps to promote a healthy heart. And there’s plenty of evidence which suggests that dancing lowers the risk of falls, which could result in a broken hip, for example, by helping people to improve their balance.\\n\\nThere are some less obvious benefits of dance for older people too. One thing I hadn’t realised before researching this topic was that dance isn’t just a physical challenge. It also requires a lot of concentration because you need to remember different steps and routines. For older people, this kind of activity is especially important because it forces their brain to process things more quickly and to retain more information.\\n\\nCurrent research also shows that dance promotes a general sense of well-being in older participants, which can last up to a week after a class. Participants report feeling less tired and having greater motivation to be more active and do daily activities such as gardening or walking to the shops or a park.\\n\\nBallroom or country dancing, both popular with older people, have to be done in groups. They require collaboration and often involve touching a dance partner, all of which encourages interaction on the dance floor. This helps to develop new relationships and can reduce older people’s sense of isolation, which is a huge problem in many countries.\\n\\nI also looked at the benefits of Zumba. Fifteen million people in 180 countries now regularly take a Zumba class, an aerobic workout based on Latin American dance moves. John Porcari, a professor of exercise and sport science at the University of Wisconsin, analysed a group of women who were Zumba regulars and found that a class lasting 40 minutes burns about 370 calories. This is similar to moderately intense exercises like step aerobics or kickboxing.\\n\\nA study in the American Journal of Health Behavior showed that when women with obesity did Zumba three times a week for 16 weeks, they lost an average of 1.2 kilos and lowered their percentage of body fat by 1%. More importantly, the women enjoyed the class so much that they made it a habit and continued to attend classes at least once a week – very unusual for an aerobic exercise programme.\\n\\nDance is never going to compete with high-intensity workouts when it comes to physical fitness gains, but its popularity is likely to keep on rising because it’s such a fun way to keep fit."';

const QUESTIONSET =
  '[{"type":"completion","title":"Complete the notes below.","instruction":"Write ONE WORD ONLY for each answer.","questions":[{"id":31,"question":"<div>\\n  <h2 style=\\"text-align:center;\\">Health benefits of dance</h2>\\n\\n  <h3>Recent findings:</h3>\\n  <ul>\\n    <li>All forms of dance produce various hormones associated with feelings of happiness.</li>\\n    <li>Dancing with others has a more positive impact than dancing alone.</li>\\n    <li>An experiment on university students suggested that dance increases {{31}}.</li>\\n    <li>For those with mental illness, dance could be used as a form of {{32}}.</li>\\n  </ul>\\n\\n  <h3>Benefits of dance for older people:</h3>\\n  <ul>\\n    <li>accessible for people with low levels of {{33}}</li>\\n    <li>reduces the risk of heart disease</li>\\n    <li>better {{34}} reduces the risk of accidents</li>\\n    <li>improves {{35}} function by making it work faster</li>\\n    <li>improves participants’ general well-being</li>\\n    <li>gives people more {{36}} to take exercise</li>\\n    <li>can lessen the feeling of {{37}}, very common in older people</li>\\n  </ul>\\n\\n  <h3>Benefits of Zumba:</h3>\\n  <ul>\\n    <li>A study at The University of Wisconsin showed that doing Zumba for 40 minutes uses up as many {{38}} as other quite intense forms of exercise.</li>\\n    <li>\\n      The American Journal of Health Behavior study showed that:\\n      <ul>\\n        <li>women suffering from {{39}} benefited from doing Zumba.</li>\\n        <li>Zumba became a {{40}} for the participants.</li>\\n      </ul>\\n    </li>\\n  </ul>\\n</div>","answer":{"31":["creativity"],"32":["therapy"],"33":["fitness"],"34":["balance"],"35":["brain"],"36":["motivation"],"37":["isolation"],"38":["calories"],"39":["obesity"],"40":["habit"]}}]}]';

export async function generateListeningTest(scenario: string) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return { audioscript: AUDIOSCRIPT.replace(/\\n/g, "\n").replace(/"/g, ""), questionset: JSON.parse(QUESTIONSET) };

  console.log("Start generating listening test");

  const monologue = await openai.chat.completions.create({
    model: "ft:gpt-4o-mini-2024-07-18:personal:listening-poc-002:ALUInKoc",
    messages: [
      {
        role: "system",
        content:
          "You are an IELTS listening test maker and your task is to create IELTS listening test part 4, a monologue on a given academic subject.",
      },
      {
        role: "user",
        content: `Write 800 words monologue for the scenario: ${scenario}. You must write exactly 800 words.`,
      },
    ],
    temperature: 0.8,
  });
  if (monologue.choices[0].finish_reason !== "stop") {
    throw new Error("Insufficient tokens to complete the task");
  }
  if (!monologue.choices[0].message.content) {
    throw new Error("No content returned from the model");
  }
  const audioscript = monologue.choices[0].message.content.replace(/\\n/g, "\n").replace(/"/g, "");
  console.info("Monologue generated:", audioscript);

  const questions = await openai.chat.completions.create({
    model: "ft:gpt-4o-mini-2024-07-18:personal:listening-poc-002:ALUInKoc",
    messages: [
      {
        role: "system",
        content:
          "You are an IELTS listening test maker and your task is to create IELTS listening test part 4, a monologue on a given academic subject.",
      },
      {
        role: "user",
        content: `Write an 800-word monologue for the scenario: ${scenario}`,
      },
      {
        role: "assistant",
        content: audioscript,
      },
      {
        role: "user",
        content: `Generate 10 completion questions based on the provided monologue. The questions should be formatted in HTML where each blank is represented by {{31}}. Each {{31}} indicates a specific word from the monologue, numbered sequentially (e.g., {{31}}, {{32}}). The blank should correspond to a single word from the monologue, and must not be a conjunction, jargon, or technical term. Output the result as JSON only, without additional \`\`\`json tag. You must generate exactly 10 questions.`,
      },
    ],
    temperature: 0.4,
  });
  if (questions.choices[0].finish_reason !== "stop") {
    throw new Error("Insufficient tokens to complete the task");
  }
  if (!questions.choices[0].message.content) {
    throw new Error("No content returned from the model");
  }
  const questionset = JSON.parse(questions.choices[0].message.content);
  console.info("Questionset generated:", JSON.stringify(questionset));

  return { audioscript, questionset };
}

export async function generateAudio(audioscript: string) {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: "listening/2024-10-26T22:37:36.854Z-x7hus.mp3" }),
    {
      expiresIn: 3600,
    }
  );
  console.log("Start generating audio");

  const [response] = await textToSpeechClient.synthesizeSpeech({
    input: { text: audioscript.replaceAll("<<BREAK>>", "") },
    voice: { name: "en-GB-Journey-D", languageCode: "en-GB" },
    audioConfig: { audioEncoding: "MP3" },
  });
  if (!response.audioContent) {
    throw new Error("No audio content returned");
  }

  const key = `listening/${new Date().toISOString()}-${Math.random().toString(36).substring(7)}.mp3`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: response.audioContent,
    })
  );

  const url = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }), {
    expiresIn: 3600,
  });
  return url;
}
