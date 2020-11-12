import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TrackTextComponent} from './track-text.component';

@NgModule({
  declarations: [TrackTextComponent],
  imports: [CommonModule],
  exports: [TrackTextComponent],
})
class TrackTextModule {}

export {TrackTextModule, TrackTextComponent};
