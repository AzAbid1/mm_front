import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  
  sessionService = inject(SessionService);
  localstorageService = inject(LocalStorageService);
  router = inject(Router);

  openAccountDetails(): void {
    this.router.navigate(['/client/edit-account']);
  }

  openChangePassword(): void {
    this.router.navigate(['/client/change-password']);
  }

  logout(): void {
    this.localstorageService.removeToken();
    this.sessionService.currentUserSig.set(undefined);
    this.router.navigateByUrl('/auth');
  }
}
