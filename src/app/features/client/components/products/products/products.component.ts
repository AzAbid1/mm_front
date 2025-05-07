import { Component, inject } from '@angular/core';
import { Product, ProductService } from '../../../../../core/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionService } from '../../../../../core/services/session.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: Product[] = [];

  router = inject(Router);
  productService = inject(ProductService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    const currentUser = this.sessionService.currentUserSig();
    if (!currentUser?._id) {
      return;
    }

    this.loadProducts(currentUser._id);
  }

  loadProducts(userId: string): void {
    this.productService.getAllProducts(userId).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Failed to load products', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  navigateToAddProduct(): void {
    this.router.navigateByUrl('/client/add-product');
  }

  navigateToProduct(productId: string | undefined): void {
    if (productId) {
      this.router.navigateByUrl(`client/products/${productId}`);
    }
  }
}
