import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class NonSocialAuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(): boolean {
    const user = this.sessionService.currentUserSig();
    console.log(user?.isSocial);
    if (user && user.isSocial) {
      this.router.navigate(['/client/dashboard']);
      return false;
    }
    return true;
  }
}
