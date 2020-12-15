import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedTargetComponent} from './shared-target.component';

@NgModule({
  declarations: [SharedTargetComponent],
  imports: [CommonModule, RouterModule],
  exports: [SharedTargetComponent],
})
class SharedTargetModule {}

export {SharedTargetModule, SharedTargetComponent};
