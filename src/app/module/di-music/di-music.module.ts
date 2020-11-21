import {NgModule} from '@angular/core';
import {DiCurrentPerformersModule} from './di-current-performers';
import {DiCurrentTrackMetasModule} from './di-current-tracks';

@NgModule({
  imports: [DiCurrentPerformersModule, DiCurrentTrackMetasModule],
  providers: [],
})
export class DiMusicModule {}
