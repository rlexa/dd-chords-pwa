import {dataToTrack, normalizeChord, normalizeTranspose, textToLines, transposeChord} from './music';

describe(`music`, () => {
  describe(`normalizeChord`, () => {
    it(`H => B`, () => expect(normalizeChord('H')).toBe('B'));
  });

  describe(`normalizeTranspose`, () => {
    it(`-23 => 0`, () => expect(normalizeTranspose(-23)).toBe(1));
    it(`-12 => 0`, () => expect(normalizeTranspose(-12)).toBe(0));
    it(`-1 => 0`, () => expect(normalizeTranspose(-1)).toBe(11));
    it(`0 => 0`, () => expect(normalizeTranspose(0)).toBe(0));
    it(`1 => 1`, () => expect(normalizeTranspose(1)).toBe(1));
    it(`11 => 11`, () => expect(normalizeTranspose(11)).toBe(11));
    it(`12 => 0`, () => expect(normalizeTranspose(12)).toBe(0));
    it(`23 => 11`, () => expect(normalizeTranspose(23)).toBe(11));
  });

  describe(`transposeChord`, () => {
    it(`transposes any chord with 'b'`, () => expect(transposeChord('Xb#+7dim', 1)).toBe('X#+7dim'));
    it(`transposes unknown chords to '#'`, () => expect(transposeChord('X+7dim', 1)).toBe('X+7dim#'));

    describe(`complete majors progression`, () => {
      const major = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B', 'C'];
      major.forEach((ii, index) =>
        it(`${major[0]} + ${index} = ${major[index]}`, () => expect(transposeChord(major[0], index)).toBe(major[index])),
      );
    });

    describe(`complete minors progression`, () => {
      const major = ['Cm', 'Cm#', 'Dm', 'Dm#', 'Em', 'Fm', 'Fm#', 'Gm', 'Gm#', 'Am', 'Bbm', 'Bm', 'Cm'];
      major.forEach((ii, index) =>
        it(`${major[0]} + ${index} = ${major[index]}`, () => expect(transposeChord(major[0], index)).toBe(major[index])),
      );
    });
  });

  describe(`textToLines`, () => {
    it(`handles text`, () =>
      expect(
        textToLines(
          `
<Em>    <Am>        <C>       <D>    <Em>
Я сижу и смотрю в чужое небо из чужого окна
      <Am>      <C>     <D>      <Em>
И не вижу ни одной знакомой звезды.

\t        <Am>           <C>   <D>    <Em>
\tЧто, взлетая, оставляет земле лишь тень.

<>
`,
          1,
        ),
      ).toEqual([
        {indent: 0, text: 'Fm      Bbm         C#        D#     Fm  '},
        {indent: 0, text: 'Я сижу и смотрю в чужое небо из чужого окна'},
        {indent: 0, text: '      Bbm       C#      D#       Fm  '},
        {indent: 0, text: 'И не вижу ни одной знакомой звезды.'},
        {indent: 0, text: ''},
        {indent: 1, text: '        Bbm            C#    D#     Fm  '},
        {indent: 1, text: 'Что, взлетая, оставляет земле лишь тень.'},
        {indent: 0, text: ''},
        {indent: 0, text: ''},
      ]));
  });

  describe(`dataToTrack`, () => {
    it(`handles data`, () => {
      expect(
        dataToTrack(
          `
#author Виктор Цой
#performer Кино
#title Пачка сигарет

<Em>        <Am>        <C>       <D>    <Em>
Я сижу и смотрю в чужое небо из чужого окна
     <Am>      <C>    <D>       <Em>
И не вижу ни одной знакомой звезды.

\t        <Am>           <C>   <D>    <Em>
\tНо если есть в кармане пачка    сигарет,
`,
        ),
      ).toEqual({
        author: 'Виктор Цой',
        performer: 'Кино',
        text: `
<Em>        <Am>        <C>       <D>    <Em>
Я сижу и смотрю в чужое небо из чужого окна
     <Am>      <C>    <D>       <Em>
И не вижу ни одной знакомой звезды.

\t        <Am>           <C>   <D>    <Em>
\tНо если есть в кармане пачка    сигарет,`,
        title: 'Пачка сигарет',
      });
    });
  });
});
