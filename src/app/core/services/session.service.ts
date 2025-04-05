import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  currentUserSig = signal<User | undefined | null>(undefined);
}
