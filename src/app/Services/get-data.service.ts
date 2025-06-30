import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetDataService {
  data: any[] = [
    {
      Id : 1,
      awardeddate: '26-06-2025',
      completion: { label: 'Yes', value: 'yes' },
      country: { name: 'Australia' },
      degreetype: { type: 'Doctoral' },
      enddate: '24-06-2025',
      institution: 'wqeqwe',
      name: 'Lucky',
      startdate: '22-06-2000',
      studymode: { type: 'On-campus' },
      title: 'CSC',
    },
    {
      Id : 2,
      awardeddate: '26-05-2025',
      completion: { label: 'Yes', value: 'yes' },
      country: { name: 'Canada' },
      degreetype: { type: 'Diploma' },
      enddate: '24-04-2025',
      institution: 'wqeqwe',
      name: 'Karuna',
      startdate: '22-01-2023',
      studymode: { type: 'Online' },
      title: 'CSC',
    },
  ];

  constructor(private http: HttpClient) {}

  getCountry(): Observable<any> {
    return this.http.get('https://www.apicountries.com/countries');
  }

  getData() {
    return this.data;
  }
}
