import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  private sessionService = inject(SessionService);
  private router = inject(Router);

  canActivate(): boolean {
    const currentUser = this.sessionService.currentUserSig();
    console.log(currentUser);
    if (currentUser) {
      return true;
    }
    
    this.router.navigate(['/auth']);
    return false;
  }
}
