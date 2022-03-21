import {Project} from './project.model';

export class SearchResultPerProject {
  project: Project;
  searchResults: [SearchResult];
}

export class SearchResult {
  basename: string;
  data: string;
  path: string;
  filename: string;
  id: number;
  ref: string;
  startline: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  project_id: number;
  project: Project;
}
