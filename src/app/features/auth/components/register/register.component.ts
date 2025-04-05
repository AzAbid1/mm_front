import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { SessionService } from '../../../../core/services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

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
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }
}
