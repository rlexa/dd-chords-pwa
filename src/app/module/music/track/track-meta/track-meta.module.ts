import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TrackMetaComponent} from './track-meta.component';

@NgModule({
  declarations: [TrackMetaComponent],
  imports: [CommonModule],
  exports: [TrackMetaComponent],
})
class TrackMetaModule {}

export {TrackMetaModule, TrackMetaComponent};
