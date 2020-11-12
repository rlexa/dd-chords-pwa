import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TrackMetaModule} from './track-meta/track-meta.module';
import {TrackTextModule} from './track-text/track-text.module';
import {TrackComponent} from './track.component';

@NgModule({
  declarations: [TrackComponent],
  imports: [CommonModule, TrackMetaModule, TrackTextModule],
  exports: [TrackComponent],
})
class TrackModule {}

export {TrackModule, TrackComponent};
