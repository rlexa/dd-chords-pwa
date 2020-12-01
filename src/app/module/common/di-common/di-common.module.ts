import {NgModule} from '@angular/core';
import {DiCurrentRouterParams, DiCurrentRouterParamsProvider} from './di-common';

@NgModule({
  providers: [DiCurrentRouterParamsProvider],
})
class DiCommonModule {}

export {DiCommonModule, DiCurrentRouterParams};
