import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {VlistComponent} from './vlist.component';

@NgModule({
  declarations: [VlistComponent],
  imports: [CommonModule, ScrollingModule],
  exports: [VlistComponent],
})
class VlistModule {}

export {VlistComponent, VlistModule};
