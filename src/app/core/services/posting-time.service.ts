import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Request payload interface
export interface PostingTimeRequest {
  platform: 'facebook' | 'instagram';
  product: string;
  tone: string;
}

// Response payload interface
export interface PostingTimeResponse {
  posting_time: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostingTimeService {
  // API base URL (update based on your environment)
  private readonly apiUrl = 'http://localhost:8004';

  constructor(private http: HttpClient) {}

  /**
   * Calls the PostingTimeModel API to predict the optimal posting time.
   * @param request The request payload containing platform, product, and tone.
   * @returns An Observable of the predicted posting time as a string.
   */
  predictPostingTime(request: PostingTimeRequest): Observable<string> {
    return this.http.post<PostingTimeResponse>(`${this.apiUrl}/predict_posting_time/`, request)
      .pipe(
        map(response => response.posting_time),
        catchError(this.handleError)
      );
  }

  /**
   * Handles HTTP errors and returns a user-friendly error message.
   * @param error The HTTP error response.
   * @returns An Observable with the error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
      if (error.error && error.error.detail) {
        errorMessage += ` - ${error.error.detail}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}