// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrlAPI: 'http://localhost:7080',
<<<<<<< HEAD
  esbaseUrlAPI: 'http://localhost:7070',
  authBaseUrlAPI: 'http://localhost:7090',
  baseUrlAPIDocUploadAPI: 'http://localhost:7081/document/upload2',
=======
/*   esbaseUrlAPI: 'http://localhost:7090',
  authBaseUrlAPI: 'http://localhost:7080',
  baseUrlAPIDocUploadAPI: 'http://localhost:7080/document/upload2',
   */
  esbaseUrlAPI: 'http://localhost:7070',
  authBaseUrlAPI: 'http://localhost:7090',
  baseUrlAPIDocUploadAPI: 'http://localhost:7081/document/upload2',

>>>>>>> master
  baseUrlJsonFile: 'http://35.154.205.109:3600/filename',
  baseUrlAPIDocUploadAnonymousAPI: 'http://localhost:7080/document/upload2'
};
// baseUrlAPI: 'http://3.110.188.89:7080',
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
