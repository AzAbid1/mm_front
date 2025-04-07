import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { UserService } from '../../../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  router = inject(Router);
  sessionService = inject(SessionService);
  localstorageService = inject(LocalStorageService);
  userService = inject(UserService);
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.userService.login({ email, password }).subscribe({
        next: (response) => {
          this.localstorageService.setToken(response.token);
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
          const user = response.user as User;
          if (user) {
            this.sessionService.currentUserSig.set(user);
          } else {
            console.error('User data not found in response');
          }
          this.router.navigateByUrl('/client');
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Login failed', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      this.snackBar.open('Invalid credentials', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        
      });
    }
  }

  loginWithGoogle(): void {
    this.userService.initiateGoogleAuth();
  }
}
