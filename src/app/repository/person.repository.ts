import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Person} from '../model/person';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonRepository {
  protected url: string = 'api/persons';

  constructor(
    private http: HttpClient
  ) {
  }

  registerPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.url, person);
  }
}
