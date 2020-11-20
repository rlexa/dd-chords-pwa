import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DiItemToRoute, DiItemToTitle} from '../../common/di-common/di-item-to-x';
import {VlistModule} from '../../common/vlist/vlist.module';
import {DiCurrentTrackMetasModule, TrackMeta} from '../../di-music/di-current-tracks';
import {TracksComponent} from './tracks.component';

@NgModule({
  declarations: [TracksComponent],
  imports: [CommonModule, VlistModule, DiCurrentTrackMetasModule],
  providers: [
    {provide: DiItemToRoute, useValue: (item: TrackMeta) => item?.id},
    {provide: DiItemToTitle, useValue: (item: TrackMeta) => item?.title || item?.id},
  ],
  exports: [TracksComponent],
})
class TracksModule {}

export {TracksModule, TracksComponent};
