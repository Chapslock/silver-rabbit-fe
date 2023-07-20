import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfessionCategory} from '../model/profession-category';

@Injectable({
  providedIn: 'root'
})
export class ProfessionCategoryRepository {
  protected url: string = 'api/profession-categories';

  constructor(
    private http: HttpClient
  ) {
  }

  findAllProfessions(): Observable<ProfessionCategory[]> {
    return this.http.get<ProfessionCategory[]>(this.url);
  }
}
