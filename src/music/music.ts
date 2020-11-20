import {md5} from 'src/util';

export interface Track {
  author?: string;
  hash?: string;
  id?: string;
  performer?: string;
  text?: string;
  title?: string;
}

export const TRACK_META_TITLE = 'title';

export interface Line {
  hasChords?: boolean;
  indent?: number;
  text?: string;
}

const lineBreaks = ['\r\n', '\r', '\n'];

const splitBreaksWin = (val: string) => val.split(lineBreaks[0]);
const splitBreaksMac = (val: string) => val.split(lineBreaks[1]);
const splitBreaksUnix = (val: string) => val.split(lineBreaks[2]);

const trimStart = (text: string) =>
  lineBreaks.reduce((acc, lineBreak) => (acc?.startsWith(lineBreak) ? acc.substr(lineBreak.length) : acc), text);
const trimEnd = (text: string) =>
  lineBreaks.reduce((acc, lineBreak) => (acc?.endsWith(lineBreak) ? acc.substr(0, acc.length - lineBreak.length) : acc), text);
const trim = (val: string) => trimEnd(trimStart(val));

const getIndent = (text: string) => (text?.startsWith('\t') ? 1 : 0);

export const TRANSPOSITIONS = 12;

export const normalizeTranspose = (transpose: number) =>
  (transpose >= 0 ? transpose : transpose + (Math.floor(Math.abs(transpose) / TRANSPOSITIONS) + 1) * TRANSPOSITIONS) % TRANSPOSITIONS;

const TONES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const transposeChord = (chord: string, transpose: number) => {
  transpose = normalizeTranspose(transpose);
  while (chord.length && transpose > 0) {
    const iDown = chord.indexOf('b');
    if (iDown > 0) {
      chord = chord.substr(0, iDown) + chord.substr(iDown + 1);
    } else {
      const iTone = TONES.findIndex((ii) => ii.includes(chord[0]));
      if (iTone >= 0) {
        const iUp = chord.indexOf('#');
        if (iUp > 0) {
          chord = chord.substr(0, iUp) + chord.substr(iUp + 1);
          chord = TONES[(iTone + 1) % TONES.length] + chord.substr(1);
        } else {
          const tone = TONES[iTone];
          if (tone === 'E' || tone === 'B') {
            chord = TONES[(iTone + 1) % TONES.length] + chord.substr(1);
          } else if (tone === 'A') {
            chord = 'Bb' + chord.substr(1);
          } else {
            chord += '#';
          }
        }
      } else {
        chord = `${chord}#`;
      }
    }
    --transpose;
  }
  return chord;
};

export const normalizeChord = (chord: string) => chord?.replace(/H/g, 'B');

const adjustChords = (transpose: number) => (text: string) =>
  normalizeChord(text)?.replace(/<(.+?)>/g, (match, chord: string, offset: number, inputString: string) =>
    transposeChord(chord, transpose).padEnd(chord.length + 2, ' '),
  );

const normalizeTextLine = (transpose: number) => (text: string) =>
  adjustChords(transpose)(text)
    ?.replace(/\t/g, '')
    .replace(/(<[^(><.)]+>)/g, '')
    .replace(/<>/g, '');

const textToLine = (transpose: number) => (text: string): Line => ({
  hasChords: text?.includes('<'),
  indent: getIndent(text),
  text: normalizeTextLine(transpose)(text),
});

const toLines = (data: string) => splitBreaksWin(trim(data)).flatMap(splitBreaksMac).flatMap(splitBreaksUnix);

export const textToLines = (text: string, transpose: number) => toLines(text).map(textToLine(transpose));

const getMeta = (lines: string[], meta: string) =>
  lines.find((line) => line.startsWith(`#${meta} `))?.substr(`#${meta} `.length) || undefined;

export const dataToTrack = (data: string): Track => {
  const lines = toLines(data);
  const ret: Track = {
    author: getMeta(lines, 'author'),
    hash: md5(data),
    performer: getMeta(lines, 'performer'),
    text: lines.filter((line) => !line.startsWith('#')).join('\n'),
    title: getMeta(lines, 'title'),
  };
  return {...ret, id: md5(`${ret.performer}|${ret.title}`)};
};
