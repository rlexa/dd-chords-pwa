import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MusicComponent} from './music.component';
import {TrackModule} from './track/track.module';

@NgModule({
  declarations: [MusicComponent],
  imports: [CommonModule, TrackModule],
  exports: [MusicComponent],
})
class MusicModule {}

export {MusicModule, MusicComponent};
