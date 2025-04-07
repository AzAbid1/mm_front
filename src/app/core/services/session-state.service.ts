import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { SessionService } from './session.service';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStateService {
  sessionService = inject(SessionService);
  localstorageService = inject(LocalStorageService);
  userService = inject(UserService);

  initializeSession(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = this.localstorageService.getToken();
      if (token) {
        const userId = this.localstorageService.getUserIdFromToken();
        console.log(userId);

        if (this.localstorageService.isValidToken()) {
          if (userId) {
            this.userService.getUserById(userId).subscribe({
              next: (response: any) => {
                // Extract the user object from the response
                const user = response.user as User;
                if (user) {
                  this.sessionService.currentUserSig.set(user); // Set only the user object
                  resolve();
                } else {
                  console.error('User data not found in response');
                  resolve();
                }
              },
              error: (err: any) => {
                console.error('Error fetching user:', err);
                resolve();
              }
            });
          } else {
            resolve();
          }
        } else {
          this.localstorageService.removeToken();
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
}