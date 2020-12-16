import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {VlistModule} from '../../common/vlist/vlist.module';
import {PerformersComponent} from './performers.component';

@NgModule({
  declarations: [PerformersComponent],
  imports: [CommonModule, VlistModule],
  exports: [PerformersComponent],
})
class PerformersModule {}

export {PerformersModule, PerformersComponent};
