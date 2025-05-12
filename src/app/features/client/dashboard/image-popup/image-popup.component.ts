import { Component, Inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-image-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule
  ],
  template: `
    <div class="image-popup">
      <div class="popup-header">
        <h2>Image Options</h2>
        <button class="close-button" (click)="close()">
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>
      
      <div class="content-wrapper">
        <div class="image-preview">
          <img [src]="data.imageUrl" [alt]="'Preview'" />
        </div>

        <div class="controls">
          <div class="scale-control">
            <div class="scale-header">
              <label>size (px):</label>
              <span class="dimensions-text">{{ width }}px × {{ height }}px</span>
            </div>
            <mat-form-field appearance="outline" class="scale-input">
              <input matInput
                type="number"
                [(ngModel)]="width"
                (ngModelChange)="updateHeightFromWidth()"
                min="50"
                max="4000"
                step="1">
            </mat-form-field>
          </div>

          <div class="actions">
            <button mat-raised-button color="primary" (click)="downloadImage()">
              <span class="material-symbols-rounded">download</span>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .image-popup {
      padding: 16px;
      background: var(--primary-color);
      border-radius: 12px;
      max-width: 800px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h2 {
        color: var(--text-color);
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
      }

      .close-button {
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .material-symbols-rounded {
          font-size: 20px;
        }
      }
    }

    .content-wrapper {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .image-preview {
      flex: 1;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 12px;
      max-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        object-fit: contain;
      }

    }

    .controls {
      width: 300px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .scale-control {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 16px;

      .scale-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        label {
          color: var(--text-color);
          font-size: 0.9rem;
        }

        .dimensions-text {
          color: var(--text-color);
          font-size: 0.8rem;
          opacity: 0.8;
        }
      }

      .scale-input {
        width: 100%;
        
        ::ng-deep {
          .mat-mdc-form-field-subscript-wrapper {
            display: none;
          }
          
          .mat-mdc-text-field-wrapper {
            background: rgba(0, 0, 0, 0.1);
          }
          
          .mat-mdc-form-field-flex {
            padding: 0 12px;
          }
          
          input {
            color: var(--text-color);
            text-align: center;
          }
        }
      }
    }

    .actions {
      button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 16px;
        font-size: 0.9rem;

        .material-symbols-rounded {
          font-size: 18px;
        }
      }
    }

    ::ng-deep {
      .mat-mdc-slider {
        .mdc-slider__track--active_fill {
          border-color: #64ffda !important;
        }
        .mdc-slider__thumb-knob {
          border-color: #64ffda !important;
        }
      }
    }

    @media (max-width: 768px) {
      .content-wrapper {
        flex-direction: column;
      }

      .controls {
        width: 100%;
      }

      .image-preview {
        max-height: 250px;
      }
    }
  `]
})
export class ImagePopupComponent {
  width: number = 512;
  height: number = 512;
  private originalWidth: number = 512;
  private originalHeight: number = 512;
  isImageLoaded: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string },
    private ngZone: NgZone
  ) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.ngZone.run(() => {
        this.originalWidth = img.width;
        this.originalHeight = img.height;
        this.width = img.width;
        this.height = img.height;
        this.isImageLoaded = true;
      });
    };
    img.onerror = () => {
      console.error('Failed to load image:', this.data.imageUrl);
      this.ngZone.run(() => {
        this.isImageLoaded = false;
      });
    };
    img.src = this.data.imageUrl;
  }

  updateHeightFromWidth(): void {
    if (!this.isImageLoaded) return;
    
    const aspectRatio = this.originalHeight / this.originalWidth;
    this.ngZone.run(() => {
      this.height = Math.round(this.width * aspectRatio);
    });
  }

  downloadImage(): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.data.imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, this.width, this.height);
        const link = document.createElement('a');
        link.download = 'generated-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
  }

  close(): void {
    this.dialogRef.close();
  }
} 