import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DiCommonModule} from 'src/app/module/common/di-common';
import {TrackMetaComponent} from './track-meta.component';

@NgModule({
  declarations: [TrackMetaComponent],
  imports: [CommonModule, DiCommonModule],
  exports: [TrackMetaComponent],
})
class TrackMetaModule {}

export {TrackMetaComponent, TrackMetaModule};
