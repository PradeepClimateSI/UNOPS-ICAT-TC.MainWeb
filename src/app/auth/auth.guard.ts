import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'shared/AppService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private router: Router, private appService: AppService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {

    let authenticated = this.appService.isAuthenticated();
    if (!authenticated){
      return false;
    }

    if (route.data && route.data["roles"] !== undefined){
      const currentRole = this.appService.getRole();
      let requiredRoles = route.data["roles"];
      let some = requiredRoles.some((r: string) => r === currentRole);
      if (some){
        return true;
      }else{
        this.appService.logout();
        return false;
      }
    }
    
    return true;
  }
  
}
