import {Component, Input, OnInit} from '@angular/core';
import {SearchResult} from '../../../shared/models/search-result.model';
import {Project} from '../../../shared/models/project.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @Input() searchResult: SearchResult;
  @Input() project: Project;


  constructor() { }

  ngOnInit(): void {
  }

  openLink(link: string) {
    const shell = window.require('electron').shell;
    shell.openExternal(link);
  }

}
