import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import {KeysPipe} from './keys.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, KeysPipe],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, KeysPipe]
})
export class SharedModule {}
