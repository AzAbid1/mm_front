import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define interfaces (as shown above)
export interface RecommendationInput {
  product: string;
  category: string;
  tone?: string;
  platform?: string;
  emotion?: string;
  base_price?: number;
  date?: string;
  lang?: string;
}

export interface RecommendationResponse {
  recommendations: any; // Replace with specific type if known
}

export interface SearchRecommendation {
  id: string;
  description: string;
  metadata: any; // Replace with specific type if known
}

export interface SearchRecommendationsResponse {
  recommendations: SearchRecommendation[];
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly apiUrl = 'http://localhost:8005'; // FastAPI server URL

  constructor(private http: HttpClient) {}

  // Call the /recommend endpoint
  getRecommendations(input: RecommendationInput): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(`${this.apiUrl}/recommend`, input).pipe(
      catchError(this.handleError)
    );
  }

  // Call the /search_recommendations endpoint
  searchRecommendations(query: string, topK: number = 5): Observable<SearchRecommendationsResponse> {
    return this.http.get<SearchRecommendationsResponse>(`${this.apiUrl}/search_recommendations`, {
      params: { query, top_k: topK.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.error.detail || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}