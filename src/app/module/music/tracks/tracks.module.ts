import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TracksComponent} from './tracks.component';

@NgModule({
  declarations: [TracksComponent],
  imports: [CommonModule, RouterModule, ScrollingModule],
  exports: [TracksComponent],
})
class TracksModule {}

export {TracksModule, TracksComponent};
