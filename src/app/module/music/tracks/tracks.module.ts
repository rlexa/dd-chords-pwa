import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ItemToRouteModule} from '../../common/di-common/item-to-route.module';
import {ItemToTitleModule} from '../../common/di-common/item-to-title.module';
import {VlistModule} from '../../common/vlist/vlist.module';
import {DiMusicModule} from '../../di-music/di-music.module';
import {TracksComponent} from './tracks.component';

@NgModule({
  declarations: [TracksComponent],
  imports: [CommonModule, RouterModule, VlistModule, DiMusicModule, ItemToRouteModule, ItemToTitleModule],
  exports: [TracksComponent],
})
class TracksModule {}

export {TracksModule, TracksComponent};
