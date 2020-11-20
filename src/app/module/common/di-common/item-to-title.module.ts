import {NgModule} from '@angular/core';
import {ItemToTitlePipe} from './item-to-title.pipe';

@NgModule({declarations: [ItemToTitlePipe], exports: [ItemToTitlePipe]})
class ItemToTitleModule {}

export {ItemToTitleModule, ItemToTitlePipe};
