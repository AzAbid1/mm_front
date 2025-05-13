import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  recommendations: {
    tone: {
      primary: string;
      justification: string;
    };
    content: {
      description: string;
      cta: string;
      format: {
        type: string;
        desc: string;
      };
    };
    visual: {
      visual_description: string;
      mood_board: {
        colors: string[];
        textures: string[];
        vibes: string;
      };
    };
    hashtags: {
      tags: string[];
      analysis: Array<{
        hashtag: string;
        reach: number;
      }>;
    };
    posting_time: {
      hour: number;
      justification: string;
    };
    strategy: {
      campaign_name: string;
      key_strategies: string[];
      influenceur: string;
      promo: string;
    };
    engagement: {
      predicted_engagement: number;
      reach: number;
      impressions: number;
      interactions: number;
    };
    weekly_plan: Array<{
      date: string;
      format: string;
      description: string;
      cta: string;
      hour: number;
      priority: string;
    }>;
    budget_roi: {
      budget: number;
      roi: string;
    };
    coach: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRecommendations(input: RecommendationInput): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(`${this.apiUrl}/recommend`, input);
  }

  searchRecommendations(query: string, top_k: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/search_recommendations`, {
      params: { query, top_k: top_k.toString() }
    });
  }
} 