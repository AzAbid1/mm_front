import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RecommendationResponse } from '../../../../../core/services/recommendation.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recommendation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './recommendation-dialog.component.html',
  styles: [`
    .section-card {
      margin-bottom: 16px;
    }
    .hashtags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    .hashtag {
      background-color: #e3f2fd;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
    }
    .hashtag-table, .weekly-plan-table {
      width: 100%;
      margin-top: 16px;
    }
    mat-card-content {
      padding: 16px;
    }
    .mood-board {
      margin-top: 16px;
    }
  `]
})
export class RecommendationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RecommendationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { recommendations: RecommendationResponse['recommendations'] }
  ) {}
} 