import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ItemToRouteModule} from '../di-common/item-to-route.module';
import {ItemToTitleModule} from '../di-common/item-to-title.module';
import {VlistComponent} from './vlist.component';

@NgModule({
  declarations: [VlistComponent],
  imports: [CommonModule, RouterModule, ScrollingModule, ItemToRouteModule, ItemToTitleModule],
  exports: [VlistComponent],
})
class VlistModule {}

export {VlistModule, VlistComponent};
