import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Browser } from '../models/Browser';
import { Observable } from 'rxjs';
import { JobEmployment } from '../models/JobEmployment';
import { RainTimeline } from '../models/RainTimeline';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private url = 'https://localhost:44324/api/Chart/';
  constructor(private http: HttpClient) {}

  getBrowsers(): Observable<Browser[]> {
    return this.http.get<Browser[]>(this.url + 'getbrowsers');
  }
  getJobEmployments(): Observable<JobEmployment[]> {
    return this.http.get<JobEmployment[]>(this.url + 'getJobEmployments');
  }
  getRainTimelines(): Observable<RainTimeline[]> {
    return this.http.get<RainTimeline[]>(this.url + 'getRainTimelines');
  }
}
