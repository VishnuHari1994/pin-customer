export const PATHS: {
  [key: string]: {
    endpoint: string;
    method: 'GET' | 'POST' | 'POST' | 'DELETE';
  };
} = {
  region: {
    endpoint: 'https://api.first.org/data/v1/countries',
    method: 'GET',
  },
};
