import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-ts';

const TOKEN = `marketmind-v01`;
const SECRET_KEY = `040c494452db50f6d209fcb09f145a2c10582fa9b5945a34cc54d72c93de2bb8`;


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  setToken(data: string) {
    const encrypted = AES.encrypt(data, SECRET_KEY).toString();
    localStorage.setItem(TOKEN, encrypted);
  }

  getToken(): string {
    const encrypted = localStorage.getItem(TOKEN);
    if (encrypted) {
      const decrypted = AES.decrypt(encrypted, SECRET_KEY).toString(enc.Utf8);
      return decrypted;
    }
    return '';
  }

  removeToken() {
    localStorage.removeItem(TOKEN);
  }

  isValidToken() {
    const token = this.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      return !this._tokenExpired(tokenDecode.exp);
    } else {
      return false;
    }
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const tokenDecode = this.decodeToken(token);
      if (tokenDecode && tokenDecode.id) {
        return tokenDecode.id;
      }
    }
    return null;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Invalid token format', e);
      return null;
    }
  }

  getUserRoleFromToken() {
    const token = this.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if (tokenDecode) {
        return tokenDecode.role;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  private _tokenExpired(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
