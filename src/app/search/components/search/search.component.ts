import {Component, Input, OnInit} from '@angular/core';
import {Storage} from '../../../shared/models/storage.model';
import {GitlabService} from '../../../shared/services/gitlab.service';
import {StorageService} from '../../../shared/services/storage.service';
import {Group} from '../../../shared/models/group.model';
import {Project} from '../../../shared/models/project.model';
import {SearchResult} from '../../../shared/models/search-result.model';

@Component({
  selector: 'app-home',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() apiKey: string | undefined;

  errorMessage: string | undefined;

  isLoaded = false;

  groups: Group[] = [];
  selectedGroupId: number;

  projects: Project[] = [];
  projectNames: string;

  searchTerm: string;
  searchResults: {[projectName: string]: SearchResult[]};

  // eslint-disable-next-line @typescript-eslint/naming-convention
  JSON: JSON;

  storage: Storage;

  constructor(private storageService: StorageService, private gitlabService: GitlabService) {
    this.JSON = JSON;
  }

  ngOnInit(): void {
    this.storageService.getStorage().subscribe(storage => {
      this.storage = storage;
      this.apiKey = storage.apiKey;
      if(this.apiKey) {
        this.loadGroups();
      }
    });
  }

  loadGroups() {
    this.projectNames = undefined;
    this.errorMessage = undefined;

    if (this.apiKey !== this.storage?.apiKey) {
      this.saveApiKey(this.apiKey);
    }

    this.gitlabService
      .loadGroups()
      .subscribe({
          next: (result) => {
            this.groups = result;

            if(this.storage?.lastSelectedGroupId) {
              this.selectedGroupId = this.storage.lastSelectedGroupId;
              this.loadProjects(this.selectedGroupId.toString());
            }
          },
          error: (error) => {
            console.error(error);
            this.errorMessage = error.message;
          }
        }
      );



    this.isLoaded = true;
  }

  loadProjects(groupIdStr: string) {
    const groupId = parseInt(groupIdStr, 10);
    this.storage.lastSelectedGroupId = groupId;
    this.storageService.saveStorage(this.storage).then(() => {});

    this.projectNames = undefined;
    this.errorMessage = undefined;

    this.gitlabService
      .loadProjects(groupId)
      .subscribe({
          next: (result: Project[]) => {
            this.projects = result;
            this.projectNames = result.map(proj => proj.name).join();
          },
          error: (error) => {
            console.error(error);
            this.errorMessage = error.message;
          }
        }
      );
  }

  searchProjects() {
    const queryNum = this.projects.length;
    this.searchResults = {};

    for (let i = 0; i < queryNum; i++) {
      const projId = this.projects[i].id;
      const projName = this.projects[i].name;
      this.gitlabService.searchProject(projId, this.searchTerm)
        .subscribe(result => {
          this.searchResults[projName] = result;
        });
    }
  }

  saveApiKey(apiKey: string) {
    this.storage = this.storage === null || this.storage === undefined ? new Storage() : this.storage;
    this.storage.apiKey = apiKey;
    this.apiKey = apiKey;
    this.storageService
      .saveStorage(this.storage)
      .then((result) => {
        // eslint-disable-next-line no-console
        console.debug(result);
      });
  }

}
