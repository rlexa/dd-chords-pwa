import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Track} from 'src/music';

const track1: Track = {
  meta: [
    {key: 'performer', value: 'Кино'},
    {key: 'title', value: 'Пачка сигарет'},
  ],
  text: `
    <Em>    <Am>        <C>       <D>    <Em>
Я сижу и смотрю в чужое небо из чужого окна
     <Am>      <C>     <D>      <Em>
И не вижу ни одной знакомой звезды.
Я ходил по всем дорогам и туда, и сюда,
Обернулся - и не смог разглядеть следы.

\t        <Am>           <C>   <D>    <Em>
\tНо если есть в кармане пачка    сигарет,
\tЗначит все не так уж плохо на сегодняшний день.
\tИ билет на самолет с серебристым крылом,
\tЧто, взлетая, оставляет земле лишь тень.

И никто не хотел быть виноватым без вина,
И никто не хотел руками жар загребать,
А без музыки на миру смерть не красна,
А без музыки не хочется пропадать.

\tНо если есть в кармане пачка сигарет,
\tЗначит все не так уж плохо на сегодняшний день.
\tИ билет на самолет с серебристым крылом,
\tЧто, взлетая, оставляет земле лишь тень.
`,
};

@Component({
  selector: 'dd-chords-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicComponent {
  readonly track = track1;
}
