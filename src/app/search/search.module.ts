import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';

import { SearchComponent } from './components/search/search.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, SharedModule, SearchRoutingModule]
})
export class SearchModule {}
