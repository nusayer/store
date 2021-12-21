import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {

  private developerURL = 'http://localhost:3001/developers';

  constructor(private http: HttpClient) { }

  public createApp(appData: any): Observable<any> {
    return this.http.post(this.developerURL + '/register', appData);
  }

  public createDevelopor(developerData: any): Observable<any> {
    return this.http.post(this.developerURL + '/register', developerData);
  }

  public updateAppDetails(key: string, data: any): Observable<any> {
    return this.http.patch(this.developerURL + `/`, data);
  }

}
