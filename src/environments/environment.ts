// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
 // baseUrlAPI: 'http://3.108.9.184/web-api',
  baseUrlPMU: 'http://3.108.9.184/pmu/login',
 // esbaseUrlAPI: 'http://3.108.9.184:7090',
    //  authBaseUrlAPI: 'http://3.108.9.184/auth-api',
  // baseUrlAPI: 'http://3.108.9.184:7080',
   baseUrlAPI: 'http://localhost:7080',
   esbaseUrlAPI: 'http://localhost:7070', 
  authBaseUrlAPI: 'http://3.108.9.184:7090',
// authBaseUrlAPI: 'http://localhost:7090',
  baseUrlAPIDocUploadAPI: 'http://localhost:7080/document/upload2',
  baseUrlJsonFile: 'http://35.154.205.109:3600/filename',
  baseUrlAPIDocUploadAnonymousAPI: 'http://localhost:7080/document/upload2',
  baseUrlAuditlog :  'http://localhost:7000',
  // baseUrlAuditlog :  'http://3.108.9.184:7000',
};
  // baseUrlAPI: 'http://3.108.9.184:7080',
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
