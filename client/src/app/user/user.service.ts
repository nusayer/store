import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userURL = 'http://localhost:3001/users';

  constructor(private http: HttpClient) { }

  public createUser(data: any): Observable<any> {
    return this.http.post(this.userURL + '/register', data);
  }

  public checkReviews(hash: string): Observable<any> {
    return this.http.get(this.userURL + '/reviews');
  }

  public checkRatings(hash: string): Observable<any> {
    return this.http.get(this.userURL + '/ratings');
  }

  public giveReviews(key: string, data: any): Observable<any> {
    return this.http.patch(this.userURL + `/`, data);
  }

  public giveRatings(key: string, data: any): Observable<any> {
    return this.http.patch(this.userURL + `/`, data);
  }

}
