import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GitlabService {

  private readonly gitlabApiUrl = 'https://gitlab.corp.dir/api/v4/';
  private readonly queryParams = '?per_page=100';

  private storage$;
  private apiKey;

  constructor(private http: HttpClient, private storageService: StorageService) {
    this.storage$ = this.storageService.getStorage();
    this.storage$.subscribe(storage => {
      this.apiKey = storage.apiKey;
    });
  }

  public loadGroups() {
    return this.httpGet('groups');
  }

  public loadProjects(groupId: number) {
    return this.httpGet(`groups/${groupId}/projects`);
  }

  public searchProject(projectId: number, searchTerm: string) {
    //TODO: no url encoding
    return this.httpGet(`projects/${projectId}/search?scope=blobs&search=${searchTerm}`, false);
  }

  private httpGet(apiUrl: string, appendQueryParams = true) {
    let headers = new HttpHeaders();
    headers = headers
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('private-token', this.apiKey);
    return this.http.get<any>(this.gitlabApiUrl + apiUrl + (appendQueryParams ? this.queryParams : '') ,  { headers });
  }

}
