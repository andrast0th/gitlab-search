import {Injectable} from '@angular/core';
import {ElectronService} from '../../core/services/electron/electron.service';
import {Storage} from '../models/storage.model';
import {defer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly fileName = 'storage';

  constructor(private electronService: ElectronService) {}

  getStorage() {
    return defer(() => this.electronService.loadData(this.fileName));
  }

  saveStorage(storage: Storage) {
    return this.electronService.saveData(this.fileName, storage);
  }

}
