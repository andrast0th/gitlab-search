import {Component, Input, OnInit} from '@angular/core';
import {Storage} from '../../../shared/models/storage.model';
import {GitlabService} from '../../../shared/services/gitlab.service';
import {StorageService} from '../../../shared/services/storage.service';
import {Group} from '../../../shared/models/group.model';
import {Project} from '../../../shared/models/project.model';
import {SearchResultPerProject} from '../../../shared/models/search-result.model';

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
  gitlabBaseUrl: string;
  searchResults: SearchResultPerProject[];

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
      this.gitlabBaseUrl = storage.gitlabBaseUrl;
      if(this.apiKey && this.gitlabBaseUrl) {
        this.loadGroups();
      }
    });
  }

  loadGroups() {
    this.isLoaded = false;
    this.projectNames = undefined;
    this.errorMessage = undefined;

    let obs;
    if (this.apiKey !== this.storage?.apiKey || this.gitlabBaseUrl !== this.storage?.gitlabBaseUrl) {
      obs = this.saveApiKey(this.apiKey, this.gitlabBaseUrl)
        .then(() => this.gitlabService.loadStorage())
        .then(() => new Promise(r => setTimeout(r, 100)));
    }

    if(obs) {
      obs.then(() => {
        this.loadGroupsUI();
      });
    } else {
      this.loadGroupsUI();
    }
  }

  private loadGroupsUI() {
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
            this.projectNames = result.map(proj => proj.name).join(', ');
          },
          error: (error) => {
            console.error(error);
            this.errorMessage = error.message;
          }
        }
      );
  }

  searchProjects() {
    if(this.searchTerm && this.searchTerm.length > 3) {
      return this.gitlabService
        .searchProjects(this.projects, this.searchTerm)
        .subscribe(result => {
          this.searchResults = result;
        });
    }
  }

  saveApiKey(apiKey: string, gitlabBaseUrl: string) {
    this.storage = this.storage === null || this.storage === undefined ? new Storage() : this.storage;
    this.storage.apiKey = apiKey;
    this.storage.gitlabBaseUrl = gitlabBaseUrl;
    this.apiKey = apiKey;
    this.gitlabBaseUrl = gitlabBaseUrl;
    return this.storageService.saveStorage(this.storage);
  }

}
