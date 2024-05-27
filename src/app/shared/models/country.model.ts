export interface RegionListModel {
  data: RegionAndCountryModel;
  status: string;
  'status-code': string;
  access: string;
}

export interface RegionAndCountryModel {
  [key: string]: { country: string; region: string };
}
