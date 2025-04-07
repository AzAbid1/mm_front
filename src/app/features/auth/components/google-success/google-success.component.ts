import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { SessionService } from '../../../../core/services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-google-success',
  template: `<p>Redirecting...</p>`,
})
export class GoogleSuccessComponent implements OnInit {
  route = inject(ActivatedRoute);
  localStorageService = inject(LocalStorageService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  userService = inject(UserService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const id = params['id'];

      if (token) {
        this.localStorageService.setToken(token);
        this.snackBar.open('Logged in with Google!', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-success',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.userService.getUserById(id).subscribe({
          next: (response: any) => {
            const user = response.user as User; // Extract the user object
            if (user) {
              this.sessionService.currentUserSig.set(user); // Set only the user object
            } else {
              console.error('User data not found in response');
              this.snackBar.open('Failed to fetch user data', 'Close', {
                duration: 3000,
                panelClass: 'snackbar-error',
                horizontalPosition: 'end',
                verticalPosition: 'bottom'
              });
              this.router.navigateByUrl('/login');
            }
          },
          error: (err: any) => {
            console.error('Error fetching user:', err);
            this.snackBar.open('Failed to fetch user data', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-error',
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
            this.router.navigateByUrl('/login');
          }
        });
        this.router.navigateByUrl('/client');
      } else {
        this.snackBar.open('Google login failed', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.router.navigateByUrl('/login');
      }
    });
  }
}