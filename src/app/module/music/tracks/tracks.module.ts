import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TracksComponent} from './tracks.component';

@NgModule({
  declarations: [TracksComponent],
  imports: [CommonModule],
  exports: [TracksComponent],
})
class TracksModule {}

export {TracksModule, TracksComponent};
