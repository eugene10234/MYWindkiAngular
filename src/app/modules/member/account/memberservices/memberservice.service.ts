import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginPost } from 'src/app/login-helper/services/interfaces/login.model';
import { Observable } from 'rxjs';
import { ProfileData } from '../shared/interfaces/profile.interface';
@Injectable({
  providedIn: 'root'
})
export class MemberserviceService {
  private apiUrl = environment.server.baseUrl + '/Member';

  updateProfile(formData: ProfileData): Observable<any> {
    return this.http.post(`${this.apiUrl}/profileUpdate`, formData);
  }

  private url = environment.server.baseUrl+'/Member';
  constructor(private http: HttpClient ) { }
  profileOninit(): Observable<any>  {
    //console.log(loginValue);
    return this.http.get(this.url + '/profileOninit');

  }
}
