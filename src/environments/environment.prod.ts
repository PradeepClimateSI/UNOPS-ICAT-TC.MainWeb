// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrlAPI: 'https://icat-tc-tool.climatesi.com/web-api',
  esbaseUrlAPI: 'http://15.206.202.183:7090',
  authBaseUrlAPI: 'https://icat-tc-tool.climatesi.com/auth-api',
  baseUrlAPIDocUploadAPI: 'https://icat-tc-tool.climatesi.com/web-api/document/upload2',
  
  baseUrlAuditlog :  'https://icat-tc-tool.climatesi.com/audit-api',
  baseUrlJsonFile: 'http://15.206.202.183:3600/filename',
  baseUrlAPIDocUploadAnonymousAPI: 'https://icat-tc-tool.climatesi.com/web-api/document/upload2',
  baseUrlDownloadByNamaAPI: 'https://icat-tc-tool.climatesi.com/web-api/document/downloadDocumentsFromFileName',
  baseUrlExcelUpload:  'https://icat-tc-tool.climatesi.com/web-api/parameter/upload',
  baseUrlPMU: 'https://icat-tc-tool.climatesi.com/pmu/login',
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
