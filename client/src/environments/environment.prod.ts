//const host = 'http://pluviometriehaiti.sipr.ucl.ac.be:8080'; // LOCAL UCL
const host = 'https://client-d4rk694.c9users.io';

const url = '/api';
export const environment = {
  production: true,
  apiHost: host,
  apiUrl: `${host}${url}`
};
