import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../../../../core/services/product.service';
import { SessionService } from '../../../../../core/services/session.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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

  ngOnInit(): void {
    const currentUser = this.sessionService.currentUserSig();
    if (!currentUser?._id) {
      
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

  navigateBack(): void {
    this.router.navigateByUrl('client/my-products');
  }
}
