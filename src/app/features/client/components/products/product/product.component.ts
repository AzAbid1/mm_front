import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../../../../core/services/product.service';
import { SessionService } from '../../../../../core/services/session.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { RecommendationService } from '../../../../../core/services/recommendation.service';
import { RecommendationDialogComponent } from '../recommendation-dialog/recommendation-dialog.component';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  product: Product | null = null;

  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  recommendationService = inject(RecommendationService);

  ngOnInit(): void {
    const currentUser = this.sessionService.currentUserSig();
    if (!currentUser?._id) {
      return;
    }
    console.log(this.route.snapshot.paramMap)
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
        this.product = product;
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Failed to load product', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.router.navigateByUrl('/products');
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
              duration: 3000,
              panelClass: 'snackbar-error',
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  getRecommendations(): void {
    if (!this.product) return;
    console.log(this.product)
    this.recommendationService.getRecommendations({
      product: this.product.name,
      category: this.product.category,
      base_price: this.product.price,
      emotion: "joie",
      lang: 'français'
    }).subscribe({
      next: (response) => {
        this.dialog.open(RecommendationDialogComponent, {
          width: '800px',
          maxHeight: '90vh',
          data: { recommendations: response.recommendations }
        });
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Failed to get recommendations', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  navigateBack(): void {
    this.router.navigateByUrl('client/my-products');
  }
}
