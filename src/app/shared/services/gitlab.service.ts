import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from './storage.service';
import {SearchResult, SearchResultPerProject} from '../models/search-result.model';
import {combineLatest, map, Observable} from 'rxjs';
import {Project} from '../models/project.model';
import {Group} from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GitlabService {

  private readonly queryParams = '?per_page=100';
  private gitlabApiUrl;
  private apiKey;

  constructor(private http: HttpClient, private storageService: StorageService) {
    this.loadStorage();
  }

  public loadStorage() {
    this.storageService.getStorage().subscribe(storage => {
      this.apiKey = storage.apiKey;
      this.gitlabApiUrl = storage.gitlabBaseUrl;
    });
  }

  public loadGroups() {
    return this.httpGet<[Group]>('groups');
  }

  public loadProjects(groupId: number) {
    return this.httpGet<[Project]>(`groups/${groupId}/projects`);
  }

  public searchProject(project: Project, searchTerm: string): Observable<SearchResultPerProject> {
    //TODO: no url encoding
    const url = `projects/${project.id}/search?scope=blobs&search=${searchTerm}`;
    return this.httpGet<[SearchResult]>(url, false)
      .pipe(map(results => results.map(result => {
              result.project = project;
              return result;
            }
          )
        ))
      .pipe(map(results => ({
            project,
            searchResults: results
          } as SearchResultPerProject)
        ));
  }

  public searchProjects(projects: Project[], searchTerm: string) {
    return combineLatest(projects.map(project => this.searchProject(project, searchTerm)));
  }

  private httpGet<T>(apiUrl: string, appendQueryParams = true): Observable<T> {
    let headers = new HttpHeaders();
    headers = headers
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('private-token', this.apiKey);
    return this.http.get<T>(this.gitlabApiUrl + apiUrl + (appendQueryParams ? this.queryParams : ''), {headers});
  }

}
