import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {VlistModule} from '../../common/vlist/vlist.module';
import {DiCurrentTrackMetasModule} from '../../di-music/di-current-tracks';
import {TracksComponent} from './tracks.component';

@NgModule({
  declarations: [TracksComponent],
  imports: [CommonModule, VlistModule, DiCurrentTrackMetasModule],
  exports: [TracksComponent],
})
class TracksModule {}

export {TracksModule, TracksComponent};
