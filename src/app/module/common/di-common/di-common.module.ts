import {NgModule} from '@angular/core';
import {DiCurrentRouterParams, DiCurrentRouterParamsProvider, DiOnline} from './di-common';

@NgModule({
  providers: [DiCurrentRouterParamsProvider],
})
class DiCommonModule {}

export {DiCommonModule, DiCurrentRouterParams, DiOnline};
