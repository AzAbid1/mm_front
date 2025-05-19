import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { UserService } from '../../../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../core/models/user.model';
import { trigger, style, animate, transition, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(100px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
    ]),
    trigger('fieldAnimation', [
      transition(':enter', [
        query('mat-form-field', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(150, [
            animate('500ms ease-out', keyframes([
              style({ opacity: 0, transform: 'translateY(30px)', offset: 0 }),
              style({ opacity: 0.5, transform: 'translateY(-10px)', offset: 0.7 }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
            ])),
          ]),
        ]),
      ]),
    ]),
    trigger('logoAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('800ms ease-out', keyframes([
          style({ opacity: 0, transform: 'scale(0.5)', offset: 0 }),
          style({ opacity: 0.7, transform: 'scale(1.2)', offset: 0.7 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
        ])),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  fieldAnimationState = 'enter';

  router = inject(Router);
  sessionService = inject(SessionService);
  localstorageService = inject(LocalStorageService);
  userService = inject(UserService);
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
            duration: 4000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
          const user = response.user as User;
          if (user) {
            this.sessionService.currentUserSig.set(user);
          } else {
            console.error('User data not found in response');
          }
          this.router.navigateByUrl('client/dashboard');
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Login failed', 'Close', {
            duration: 4000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        },
      });
    } else {
      this.snackBar.open('Please check your credentials', 'Close', {
        duration: 4000,
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