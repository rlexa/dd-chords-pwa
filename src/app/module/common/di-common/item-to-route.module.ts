import {NgModule} from '@angular/core';
import {ItemToRoutePipe} from './item-to-route.pipe';

@NgModule({declarations: [ItemToRoutePipe], exports: [ItemToRoutePipe]})
class ItemToRouteModule {}

export {ItemToRouteModule, ItemToRoutePipe};
