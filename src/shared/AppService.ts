import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthControllerServiceProxy, RefreshReqRes } from './service-proxies/auth-service-proxies';
import { ServiceProxy } from './service-proxies/service-proxies';

import { UserIdleService } from "angular-user-idle";
import { ConfirmationService } from 'primeng/api';
import { User } from './service-proxies/service-proxies';


export enum RecordStatus {
  Deleted = -20,
  InActive = -10,
  Active = 0,
}

export enum LoginRole {
  MASTER_ADMIN = "MASTER_ADMIN",
  CSI_ADMIN = "CSI_ADMIN",
  ORG_ADMIN = "ORG_ADMIN",
  ORG_USER = "ORG_USER",
}

export enum AuthData{
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  LOGIN_PROFILE_ID = "LOGIN_PROFILE_ID",
  USER_NAME = "USER_NAME",
  ROLE = "ROLE"
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
  /**
   * Contains in-progress loading requests
   */
  loadingMap: Map<string, boolean> = new Map<string, boolean>();
  
  private _isAuthenticated: boolean;
  public isDataupdated = new BehaviorSubject<boolean>(true);
  private refreshTokenTimeout: any;

  constructor(
    private confirmationService: ConfirmationService,
    private userIdle: UserIdleService, 
    private router: Router, 
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private serviceProxy: ServiceProxy,
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

    /*Session logout */
    this.userIdle.startWatching(); //Start watching for user inactivity.
    this.userIdle.onTimerStart().subscribe((count) => {});
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      // show dialog
      this.confirmationService.confirm({
        message: 'Please login again ',
        header: 'Session expired',
        acceptIcon: 'icon-not-visible',
        acceptLabel: 'Ok',
        rejectVisible: false,
        accept: () => {
          this.userIdle.resetTimer();
          this.userIdle.stopWatching();
          this.logout();
        },
        reject: () => {
          this.userIdle.resetTimer();
          this.userIdle.stopWatching();
          this.logout()
        }
      });
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
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }    
  }

  private refreshToken() {
    let b = new RefreshReqRes();
      let token = this.getRefreshToken()
      if(token){
        b.token =  `${token}`;
      }
      return this.authControllerServiceProxy.refresh(b)
      .pipe(map(res => {
        this.steToken(res.token);
        this.startRefreshTokenTimer();
      }))
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
    this.router.navigate(['auth']);
  }

  private clearData(){
    localStorage.clear();
  }

  update() {
    this.isDataupdated.next(true);
  }

  steToken(tocken: string): void {
    localStorage.setItem(AuthData.ACCESS_TOKEN, tocken)
  }

  getToken(): string | null {
    return localStorage.getItem(AuthData.ACCESS_TOKEN);
  }

  steRole(role: string): void {
    localStorage.setItem(AuthData.ROLE, role)
  }

  getRole(): string | null {
    return localStorage.getItem(AuthData.ROLE);
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


  /**
   * Sets the loadingSub property value based on the following:
   * - If loading is true, add the provided url to the loadingMap with a true value, set loadingSub value to true
   * - If loading is false, remove the loadingMap entry and only when the map is empty will we set loadingSub to false
   * This pattern ensures if there are multiple requests awaiting completion, we don't set loading to false before
   * other requests have completed. At the moment, this function is only called from the @link{HttpRequestInterceptor}
   * @param loading {boolean}
   * @param url {string}
   */
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
