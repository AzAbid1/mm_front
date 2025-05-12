import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../../../../core/services/product.service';
import { SessionService } from '../../../../../core/services/session.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecommendationResponse, RecommendationService, RecommendationInput } from '../../../../../core/services/recommendation.service';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  product: Product | null = null;
  recommendationForm: FormGroup;
  recommendation: RecommendationResponse | null = null;
  recommendationError: string | null = null;
  isLoadingRecommendation = false;
  // Valid categories based on backend (added Technology)
  validCategories = ['fashion', 'tech', 'food', 'Technology'];

  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  fb = inject(FormBuilder);
  recommendationService = inject(RecommendationService);

  constructor() {
    // Initialize recommendation form
    this.recommendationForm = this.fb.group({
      product: [{ value: '', disabled: true }, Validators.required],
      category: ['', Validators.required], // Category is now editable
      tone: ['auto'],
      platform: ['instagram'],
      emotion: ['joie'],
      base_price: [null],
      date: [null],
      lang: ['français']
    });
  }

  ngOnInit(): void {
    const currentUser = this.sessionService.currentUserSig();
    if (!currentUser?._id) {
      this.snackBar.open('User not authenticated', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      this.router.navigateByUrl('/login');
      return;
    }

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.snackBar.open('Invalid product ID', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      this.router.navigateByUrl('/products');
    }
  }

  loadProduct(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        console.log('Loaded product:', product);
        this.product = product;
        // Validate product name only
        if (!product?.name?.trim()) {
          console.warn('Invalid product data:', { name: product?.name });
          this.recommendationForm.disable();
          this.snackBar.open('Product name is invalid', 'Close', {
            duration: 5000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
          return;
        }
        // Patch product name and base_price, leave category for user selection
        this.recommendationForm.patchValue({
          product: product.name.trim(),
          base_price: product.price || null
        });
      },
      error: (error) => {
        console.error('Failed to load product:', error);
        this.snackBar.open(error.message || 'Failed to load product', 'Close', {
          duration: 5000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.router.navigateByUrl('/products');
      }
    });
  }

  getRecommendation(): void {
    if (this.recommendationForm.invalid || !this.product) {
      console.warn('Form invalid or product not loaded');
      this.snackBar.open('Please ensure all required fields are valid', 'Close', {
        duration: 5000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.isLoadingRecommendation = true;
    this.recommendationError = null;
    const input: RecommendationInput = {
      product: this.product.name.trim(),
      category: this.recommendationForm.get('category')!.value,
      tone: this.recommendationForm.get('tone')!.value,
      platform: this.recommendationForm.get('platform')!.value,
      emotion: this.recommendationForm.get('emotion')!.value,
      base_price: this.recommendationForm.get('base_price')!.value,
      date: this.recommendationForm.get('date')!.value,
      lang: this.recommendationForm.get('lang')!.value
    };

    console.log('Sending recommendation input:', input);
    this.recommendationService.getRecommendations(input).subscribe({
      next: (response) => {
        console.log('Recommendation response:', response);
        this.recommendation = response;
        this.isLoadingRecommendation = false;
        this.snackBar.open('Recommendation fetched successfully', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-success',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: (error) => {
        console.error('Recommendation error:', error);
        console.log('Full error response:', error);
        const errorMessage = error.error?.detail || error.message || 'Failed to fetch recommendation';
        this.recommendationError = errorMessage;
        this.isLoadingRecommendation = false;
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  navigateToEdit(): void {
    if (this.product?._id) {
      this.router.navigateByUrl(`client/products/edit/${this.product._id}`);
    }
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { productName: this.product?.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.product?._id) {
        this.productService.deleteProduct(this.product._id).subscribe({
          next: () => {
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-success',
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
            this.router.navigateByUrl('client/my-products');
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Failed to delete product', 'Close', {
              duration: 5000,
              panelClass: 'snackbar-error',
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  navigateBack(): void {
    this.router.navigateByUrl('client/my-products');
  }
}
