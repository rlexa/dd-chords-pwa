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
      const major = ['Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm', 'Cm'];
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

~        <Am>           <C>   <D>    <Em>
~Что, взлетая, оставляет земле лишь тень.

<>
`,
          1,
          true,
        ),
      ).toEqual([
        {indent: 0, text: 'Fm      Bbm         C#        D#     Fm  ', hasChords: true},
        {indent: 0, text: 'Я сижу и смотрю в чужое небо из чужого окна', hasChords: false},
        {indent: 0, text: '      Bbm       C#      D#       Fm  ', hasChords: true},
        {indent: 0, text: 'И не вижу ни одной знакомой звезды.', hasChords: false},
        {indent: 0, text: '', hasChords: false},
        {indent: 1, text: '        Bbm            C#    D#     Fm  ', hasChords: true},
        {indent: 1, text: 'Что, взлетая, оставляет земле лишь тень.', hasChords: false},
        {indent: 0, text: '', hasChords: false},
        {indent: 0, text: '', hasChords: false},
      ]));
  });

  describe(`dataToTrack`, () => {
    it(`handles data`, () => {
      expect(
        dataToTrack(
          `
#performer Кино
#title Пачка сигарет

<Em>        <Am>        <C>       <D>    <Em>
Я сижу и смотрю в чужое небо из чужого окна
     <Am>      <C>    <D>       <Em>
И не вижу ни одной знакомой звезды.

~        <Am>           <C>   <D>    <Em>
~Но если есть в кармане пачка    сигарет,
`,
        ),
      ).toEqual({
        hash: 'c0a58c03d274c58f22b1fde05fcf7996',
        id: '26f931645101b5b93c0f7be944f4563a',
        performer: 'Кино',
        text: `
<Em>        <Am>        <C>       <D>    <Em>
Я сижу и смотрю в чужое небо из чужого окна
     <Am>      <C>    <D>       <Em>
И не вижу ни одной знакомой звезды.

~        <Am>           <C>   <D>    <Em>
~Но если есть в кармане пачка    сигарет,`,
        title: 'Пачка сигарет',
      });
    });
  });
});
