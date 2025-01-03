import {md5} from 'src/util';

export interface Track {
  data?: string;
  hash?: string;
  id?: string;
  performer?: string;
  performerHash?: string;
  playlists?: string;
  title?: string;
}

export const TRACK_META_TITLE = 'title';

export interface Line {
  hasChords?: boolean;
  indent?: number;
  text?: string;
}

export const metaLine = '#';
export const metaPerformer = 'performer';
export const metaTitle = 'title';

const lineBreaks = ['\r\n', '\r', '\n'];

const splitBreaksWin = (val: string) => val.split(lineBreaks[0]);
const splitBreaksMac = (val: string) => val.split(lineBreaks[1]);
const splitBreaksUnix = (val: string) => val.split(lineBreaks[2]);

const trimStart = (text: string) =>
  lineBreaks.reduce((acc, lineBreak) => (acc?.startsWith(lineBreak) ? acc.substr(lineBreak.length) : acc), text);
const trimEnd = (text: string) =>
  lineBreaks.reduce((acc, lineBreak) => (acc?.endsWith(lineBreak) ? acc.substr(0, acc.length - lineBreak.length) : acc), text);
const trim = (val: string) => trimEnd(trimStart(val));

const getIndent = (text: string) => (text?.startsWith('~') ? 1 : 0);

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
            chord = chord.substr(0, 1) + '#' + chord.substr(1);
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
  normalizeChord(text)?.replace(/<(.+?)>/g, (match, chord: string) => transposeChord(chord, transpose).padEnd(chord.length + 2, ' '));

const normalizeTextLine = (text: string, transpose: number) =>
  adjustChords(transpose)(text)
    ?.replace(/\t/g, '')
    .replace(/^~/g, '')
    .replace(/(<[^(><.)]+>)/g, '')
    .replace(/<>/g, '');

const textToLine =
  (transpose: number) =>
  (text: string): Line => ({
    hasChords: !!text?.match(/<(.+?)>/g)?.length,
    indent: getIndent(text),
    text: normalizeTextLine(text, transpose),
  });

const toLines = (data: string) => splitBreaksWin(trim(data)).flatMap(splitBreaksMac).flatMap(splitBreaksUnix);

export const textToLines = (text: string, transpose: number, withChords: boolean) =>
  toLines(text)
    .filter((line) => !line.startsWith(metaLine))
    .map(textToLine(transpose))
    .filter((line) => withChords || !line.hasChords)
    .map<Line>((line) => (withChords ? line : {...line, text: line.text?.replace(/\s{2,}/g, ' ').replace(/^\s/g, '')}));

const getMeta = (lines: string[], meta: string) =>
  lines.find((line) => line.startsWith(`${metaLine}${meta} `))?.substr(`#${meta} `.length) || undefined;

export const dataToTrack = (data: string): Track => {
  const lines = toLines(data);
  const ret: Track = {
    data,
    hash: md5(data),
    performer: getMeta(lines, metaPerformer),
    title: getMeta(lines, metaTitle),
  };
  return {...ret, id: md5(`${ret.performer}|${ret.title}`), performerHash: md5(ret.performer ?? '')};
};

export const getId = <T extends {id?: string}>(item: T) => item?.id;
export const getTitle = <T extends {title?: string}>(item: T) => item?.title;

export const sortByTitle = <T extends {title?: string}>(aa: T, bb: T) => (getTitle(aa) || '').localeCompare(getTitle(bb) || '');

export const trackToData = (track: Track) => track.data;
