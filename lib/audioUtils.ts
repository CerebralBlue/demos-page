import { Readable, PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
// ffmpeg.setFfmpegPath('H:/Descargas/ffmpeg-7.1.1-full_build/ffmpeg-7.1.1-full_build/bin/ffmpeg.exe');

export function convertWebmToPcm(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const input = new Readable();
    input.push(buffer);
    input.push(null);

    const output = new PassThrough();
    const chunks: Buffer[] = [];

    output.on('data', chunk => chunks.push(chunk));
    output.on('end', () => resolve(Buffer.concat(chunks)));
    output.on('error', reject);

    ffmpeg(input)
      .inputFormat('webm')
      .audioFrequency(16000)
      .audioChannels(1)
      .audioCodec('pcm_s16le')
      .format('s16le')
      .on('error', reject)
      .pipe(output, { end: true });
  });
}