import { NextRequest, NextResponse } from 'next/server';
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { convertWebmToPcm } from '@/lib/audioUtils';


const REGION = 'us-east-1';

const transcribeClient = new TranscribeStreamingClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const pollyClient = new PollyClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const CHUNK_SIZE = 3200; 
const splitBuffer = (buffer: Buffer) => {
  const chunks: Buffer[] = [];
  let offset = 0;
  while (offset < buffer.length) {
    chunks.push(buffer.slice(offset, offset + CHUNK_SIZE));
    offset += CHUNK_SIZE;
  }

  return chunks;
};
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  console.log(formData)
  const file = formData.get('file') as Blob | null;
  const jsonData = formData.get('jsonData') as string | null;
    const webmBuffer = Buffer.from(await file!.arrayBuffer());
    const pcmBuffer = await convertWebmToPcm(webmBuffer);
    const chunks = splitBuffer(pcmBuffer);
    const command = new StartStreamTranscriptionCommand({
    LanguageCode: 'es-US',
    MediaEncoding: 'pcm',
    MediaSampleRateHertz: 16000,
    AudioStream: async function* () {
      for (const chunk of chunks) {
        yield { AudioEvent: { AudioChunk: chunk } }; 
        await sleep(50);
      }
    }(),
  });

  const response = await transcribeClient.send(command);

  let transcriptText = '';

  for await (const event of response.TranscriptResultStream!) {
    if (event.TranscriptEvent?.Transcript?.Results?.length) {
      const results = event.TranscriptEvent.Transcript.Results;
      const finalResult = results.find((r) => r.IsPartial === false);
      if (finalResult?.Alternatives?.[0]?.Transcript) {
        transcriptText += finalResult.Alternatives[0].Transcript + ' ';
      }
    }
  }
  console.log(transcriptText)

  const apiResponse = await fetch('https://stagingapi.neuralseek.com/v1/NS-ES-V2/maistro/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': 'e907252c-a14c702d-a0ae2b3b-490872cd' },
    body: JSON.stringify(
      {
        agent: "bookingHours", 
        params : [
          {
            name:"request", value: transcriptText.trim()
          },
          {
            name:"jsonSch", value: jsonData
          }
        ] 
      }
    ),
  });


  const respuesta = await apiResponse.text();
  const jsonResponse = JSON.parse(respuesta);
  let answer = jsonResponse.answer;
  console.log(answer);
  let cleanedAnswer = answer.trim();
  let textToSpeak = '';
  let updatedJson = null;
  
  try {
    let cleanedAnswer = answer.trim();
  

    if (cleanedAnswer.startsWith('```json')) {
      cleanedAnswer = cleanedAnswer.replace(/^```json/, '').trim();
    }
    if (cleanedAnswer.endsWith('```')) {
      cleanedAnswer = cleanedAnswer.replace(/```$/, '').trim();
    }
  
    if (cleanedAnswer.startsWith('[') && !cleanedAnswer.endsWith(']')) {
      cleanedAnswer += ']';
    }
  
    const parsed = JSON.parse(cleanedAnswer);
  
    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === 'string') {
        textToSpeak = `Sure, these are the available hours for booking: ${parsed.join(', ')}. Which one do you want to book?`;
      } else if (
        typeof parsed[0] === 'object' &&
        parsed[0] !== null &&
        'day' in parsed[0] &&
        'hour' in parsed[0] &&
        'appointment' in parsed[0]
      ) {
        textToSpeak = `Your schedule has been updated.`;
        updatedJson = parsed;
      } else {
        textToSpeak = answer || 'There was no response.';
      }
    } else {
      textToSpeak = answer || 'There was no response.';
    }
  } catch {
    textToSpeak = answer || 'There was no response.';
  }
  
  const pollyCmd = new SynthesizeSpeechCommand({
    OutputFormat: 'mp3',
    Text: textToSpeak,
    VoiceId: 'Joanna', 
    LanguageCode: 'en-US',
  });
  

const { AudioStream } = await pollyClient.send(pollyCmd);

const audioChunks: Buffer[] = [];
for await (const chunk of AudioStream as any) {
  audioChunks.push(chunk);
}

const audioBufferResponse = Buffer.concat(audioChunks);
const responsePayload = new NextResponse(audioBufferResponse, {
  headers: {
    'Content-Type': 'audio/mpeg',
  },
});

if (updatedJson) {
  responsePayload.headers.set('x-updated-json', JSON.stringify(updatedJson));
}

return responsePayload;

}
