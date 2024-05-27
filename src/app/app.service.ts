import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATHS } from './shared/constants/environment.path';
import { Observable } from 'rxjs';
import { RegionListModel } from './shared/models/country.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private httpClient: HttpClient) {}

/**
 * Retrieves a list of regions by making an HTTP GET request to the specified endpoint.
 * @returns An Observable of type RegionListModel containing the list of regions.
 */
getRegionList(): Observable<RegionListModel> {
  return this.httpClient.get<RegionListModel>(PATHS['region'].endpoint);
}
}
