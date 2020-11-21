import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {VlistModule} from '../../common/vlist/vlist.module';
import {DiMusicModule} from '../../di-music/di-music.module';
import {TracksComponent} from './tracks.component';

@NgModule({
  declarations: [TracksComponent],
  imports: [CommonModule, VlistModule, DiMusicModule],
  exports: [TracksComponent],
})
class TracksModule {}

export {TracksModule, TracksComponent};
