import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {Track} from 'src/music';
import {DiItemToRoute, DiItemToTitle} from '../../common/di-common/di-item-to-x';
import {VlistModule} from '../../common/vlist/vlist.module';
import {DiCurrentTracksModule} from '../../di-music/di-current-tracks';
import {TracksComponent} from './tracks.component';

@NgModule({
  declarations: [TracksComponent],
  imports: [CommonModule, VlistModule, DiCurrentTracksModule],
  providers: [
    {provide: DiItemToRoute, useValue: (item: Track) => item?.id},
    {provide: DiItemToTitle, useValue: (item: Track) => item?.title || item?.id},
  ],
  exports: [TracksComponent],
})
class TracksModule {}

export {TracksModule, TracksComponent};
