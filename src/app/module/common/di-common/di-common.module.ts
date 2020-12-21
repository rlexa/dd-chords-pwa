import {NgModule} from '@angular/core';
import {ContainsPipe} from './contains.pipe';
import {DiCurrentRouterParams, DiCurrentRouterParamsProvider, DiOnline} from './di-common';

@NgModule({
  declarations: [ContainsPipe],
  providers: [DiCurrentRouterParamsProvider],
  exports: [ContainsPipe],
})
class DiCommonModule {}

export {DiCommonModule, DiCurrentRouterParams, DiOnline, ContainsPipe};
