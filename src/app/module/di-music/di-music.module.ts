import {NgModule} from '@angular/core';
import {DiCurrentPerformersModule} from './di-current-performers';
import {DiCurrentTrackMetasModule} from './di-current-tracks';
import {DiPerformersFilterModule} from './di-performers-filter.module';
import {DiTracksFilterModule} from './di-tracks-filter.module';

@NgModule({
  imports: [DiCurrentPerformersModule, DiCurrentTrackMetasModule, DiPerformersFilterModule, DiTracksFilterModule],
})
export class DiMusicModule {}
