import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { GOOGLE_CLOUD_TEXT_TO_SPEECH_API_KEY } from "../env";

export const textToSpeechClient = new TextToSpeechClient({
  apiKey: GOOGLE_CLOUD_TEXT_TO_SPEECH_API_KEY,
});
