import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../core/models/user.model';
import { SessionService } from '../../../../core/services/session.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-edit-account',
  standalone: false,
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.scss'
})
export class EditAccountComponent {
  accountForm: FormGroup;

  userService = inject(UserService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const currentUser = this.sessionService.currentUserSig();
    if (currentUser) {
      console.log(currentUser);
      console.log('Current User:', currentUser);
      console.log('Email:', currentUser.email);
      console.log('First Name:', currentUser.firstName);
      console.log('Last Name:', currentUser.lastName);
      this.accountForm.patchValue({
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName
      });
    } else {
      this.snackBar.open('User not found. Please log in again.', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
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

      const { firstName, lastName } = this.accountForm.getRawValue(); // Use getRawValue to include disabled fields
      const payload = { firstName, lastName };

      this.userService.updateUserDetails(currentUser._id, payload).subscribe({
        next: (response) => {
          // Update the session with the new user details
          const updatedUser: User = { ...currentUser, firstName, lastName };
          this.sessionService.currentUserSig.set(updatedUser);
          this.snackBar.open('Account details updated successfully!', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to update account details', 'Close', {
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
