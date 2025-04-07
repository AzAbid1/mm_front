import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../core/services/user.service';
import { SessionService } from '../../../../core/services/session.service';
@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;

  userService = inject(UserService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator() });
  }

  // Custom validator to check if newPassword and confirmNewPassword match
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const newPassword = formGroup.get('newPassword')?.value;
      const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;

      if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const currentUser = this.sessionService.currentUserSig();
      if (!currentUser || !currentUser._id) {
        this.snackBar.open('User not found. Please log in again.', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        return;
      }

      const { oldPassword, newPassword } = this.passwordForm.value;
      const payload = { oldPassword, newPassword };

      this.userService.changePassword(currentUser._id, payload).subscribe({
        next: (response) => {
          this.snackBar.open('Password updated successfully!', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
          this.passwordForm.reset(); // Reset the form on success
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to update password', 'Close', {
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
