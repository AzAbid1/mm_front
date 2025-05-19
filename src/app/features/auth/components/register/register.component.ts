import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { SessionService } from '../../../../core/services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../core/models/user.model';
import { trigger, style, animate, transition, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  fieldAnimationState = 'enter';

  router = inject(Router);
  userService = inject(UserService);
  localStorage = inject(LocalStorageService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator() });
  }

  ngOnInit(): void {}

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      if (password && confirmPassword && password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, firstName, lastName, password } = this.registerForm.value;

      this.userService.register({ email, firstName, lastName, password }).subscribe({
        next: (response) => {
          this.localStorage.setToken(response.token);
          const user: User = response.user;
          this.sessionService.currentUserSig.set(user);
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
          this.router.navigateByUrl('/client');
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Registration failed', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }
}