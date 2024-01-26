import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RefreshReqRes } from './service-proxies/auth-service-proxies';
import { ServiceProxy } from './service-proxies/service-proxies';

import { UserIdleService } from "angular-user-idle";
import { ConfirmationService } from 'primeng/api';
import { User } from './service-proxies/service-proxies';
import decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

export enum RecordStatus {
  Deleted = -20,
  InActive = -10,
  Active = 0,
}

export enum LoginRole {
  MASTER_ADMIN ="Master_Admin",
  Country_Admin = "Country Admin",
  Verifier = "Verifier",
  Sector_Admin = "Sector Admin",
  MRV_Admin = "MRV Admin",
  Country_User = "Country_User",
  Data_Collection_Team = "Data Collection Team",
  QC_Team = "QC Team",
  Institution_Admin ="Institution Admin",
  Data_Entry_Operator ="Data Entry Operator",
  External = "External",
}

export enum AuthData{
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  LOGIN_PROFILE_ID = "LOGIN_PROFILE_ID",
  USER_NAME = "USER_NAME",
  role = "ROLE",
  countryId ="COUNTRY_ID",
  InsID = "SECTOR_ID,"
}

export enum ProfileStatus {    
  InActive = -10,
  Active = 0,
  Resetting = 1,
  BlockedByWrongAttemps = 2,
  OTPValidated = 3,
  OTPFailed = 4
}

@Injectable({
  providedIn: 'root',
})
export class AppService {

  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  loadingMap: Map<string, boolean> = new Map<string, boolean>();
  
  private _isAuthenticated: boolean;
  public isDataupdated = new BehaviorSubject<boolean>(true);
  private refreshTokenTimeout: any;

  constructor(
    private confirmationService: ConfirmationService,
    private userIdle: UserIdleService, 
    private router: Router, 
    private serviceProxy: ServiceProxy,
    private httpClient: HttpClient
  ) {
    const token = this.getToken();
    this._isAuthenticated = token!==null;
  }

  public forbiddenAction(){
    this.confirmationService.confirm({
      message: 'Please login with premited user account ',
      header: 'You don\'t have access to this resources',
      acceptIcon: 'icon-not-visible',
      acceptLabel: 'Try with another user',
      rejectLabel: 'Cancel',
      accept: () => {
        this.userIdle.resetTimer();
        this.userIdle.stopWatching();
        this.logout();
      },
      reject: () => {
        
      }
    });
  }

  public startIdleTimer() {
    this.userIdle.resetTimer();
    this.userIdle.stopWatching();
    this.userIdle.setConfigValues({idle: 900, timeout: 1, ping: 600, idleSensitivity: 10});

    this.userIdle.startWatching(); 
    this.userIdle.onTimerStart().subscribe((count) => {});
    this.userIdle.onTimeout().subscribe(() => {
      this.userIdle.resetTimer();
      this.userIdle.stopWatching();
      this.logout();
    });
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  public startRefreshTokenTimer(time=null) {
    const token = this.getToken();
    if(token){
      const jwtToken = JSON.parse(atob(token.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = time === null ? expires.getTime() - ( Date.now() + (60 * 1 * 1000)): time;
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken2().subscribe(), timeout);
    }    
  }


  private refreshToken2() {
    let url = environment.authBaseUrlAPI + '/auth/refresh'
    let formData = new RefreshReqRes();
    let token = this.getRefreshToken()
    if (token) {
      formData.token = `${token}`;
    }
    return this.httpClient.post<any>(url, formData).pipe(map(res => {
      this.steToken(res.token);
      this.startRefreshTokenTimer();
    }))
  }

  getLoggedUserRole(){
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    return tokenPayload.role[0]
  }



  async getUser(): Promise<User | null>{

    const res = await this.serviceProxy.getManyBaseUsersControllerUser(
      undefined,
      undefined,
      [ "status||$ne||"+RecordStatus.Deleted, "loginProfile||$eq||"+this.getProfileId()],
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();
    if(res.data.length > 0){
      return res.data[0]
    }
    return null;
  }

  isAuthenticated(): boolean{
    return this._isAuthenticated;
  }

  logout(){
    this.clearData();
    this.stopRefreshTokenTimer();
    this.router.navigate(['/auth/login']);
  }

  private clearData(){
    localStorage.clear();
  }

  update() {
    this.isDataupdated.next(true);
  }

  steToken(tocken: string): void {
    localStorage.setItem(AuthData.ACCESS_TOKEN, tocken)
    const token = this.getToken();
    this._isAuthenticated = token!==null;
  }

  getToken(): string | null {
    return localStorage.getItem(AuthData.ACCESS_TOKEN);
  }

  steRole(role: string): void {
    localStorage.setItem(AuthData.role, role)
  }

  getRole(): string | null {
    return localStorage.getItem(AuthData.role);
  }

  stecountryId(countryId: string): void {
    localStorage.setItem(AuthData.countryId, countryId)
  }

  getCountryId(): string | null {
    return localStorage.getItem(AuthData.countryId);
  }

  steInsId(InsID: string): void {
    localStorage.setItem(AuthData.InsID, InsID)
  }

  getInsId(): string | null {
    return localStorage.getItem(AuthData.InsID);
  }
  steRefreshToken(tocken: string): void {
    localStorage.setItem(AuthData.REFRESH_TOKEN, tocken)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AuthData.REFRESH_TOKEN);
  }

  steUserName(userName: string): void {
    localStorage.setItem(AuthData.USER_NAME, userName)
  }

  getUserName(): string | null {
    return localStorage.getItem(AuthData.USER_NAME);
  }

  steProfileId(profileId: string): void {
    localStorage.setItem(AuthData.LOGIN_PROFILE_ID, profileId)
  }

  getProfileId(): string | null {
    return localStorage.getItem(AuthData.LOGIN_PROFILE_ID);
  }


   setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function');
    }
    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    }else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
  }

}
