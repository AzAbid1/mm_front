import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../../core/services/product.service';
import { SessionService } from '../../../../../core/services/session.service';

@Component({
  selector: 'app-modify-product',
  standalone: false,
  templateUrl: './modify-product.component.html',
  styleUrl: './modify-product.component.scss'
})
export class ModifyProductComponent {
  productForm: FormGroup;
  selectedFiles: (File | null)[] = [];
  fileErrors: (string | null)[] = [];
  existingImageUrls: string[] = [];
  imagesToDelete: string[] = [];
  productId: string | null = null;
  maxNewImages: number = 5;
  totalImages: number = 0;

  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      images: this.fb.array([])
    });
  }

  get imagesFormArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  ngOnInit(): void {
    const currentUser = this.sessionService.currentUserSig();
    if (!currentUser?._id) {
      this.snackBar.open('Please log in to modify a product', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      this.router.navigateByUrl('/auth/login');
      return;
    }

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProduct(this.productId);
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
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          category: product.category
        });
        this.existingImageUrls = product.imageUrls || [];
        this.updateImageCounts();
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

  addImageField(): void {
    if (this.imagesFormArray.length < this.maxNewImages) {
      this.imagesFormArray.push(this.fb.control(''));
      this.fileErrors.push(null);
      this.selectedFiles.push(null);
    }
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.fileErrors[index] = 'Only image files are allowed';
        this.selectedFiles[index] = null;
      } else {
        this.fileErrors[index] = null;
        this.selectedFiles[index] = file;
      }
    } else {
      this.fileErrors[index] = null;
      this.selectedFiles[index] = null;
    }
    this.updateImageCounts();
  }

  deleteExistingImage(index: number): void {
    const url = this.existingImageUrls[index];
    // Extract filename from URL (e.g., 'filename.jpg' from 'http://localhost:3000/images/filename.jpg')
    const filename = url.split('/').pop();
    if (filename) {
      this.imagesToDelete.push(filename);
    }
    this.existingImageUrls.splice(index, 1);
    this.updateImageCounts();
  }

  updateImageCounts(): void {
    const existingCount = this.existingImageUrls.length;
    const newCount = this.selectedFiles.filter(file => file !== null).length;
    this.totalImages = existingCount + newCount;
    this.maxNewImages = 5 - existingCount;
    // Clear excess new image fields if limit is reached
    while (this.imagesFormArray.length > this.maxNewImages) {
      this.imagesFormArray.removeAt(this.imagesFormArray.length - 1);
      this.selectedFiles.pop();
      this.fileErrors.pop();
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.totalImages > 0 && this.productId) {
      const currentUser = this.sessionService.currentUserSig();
      if (!currentUser?._id) {
        this.snackBar.open('User not found', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        return;
      }

      const productData = {
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        category: this.productForm.value.category
      };

      const validFiles = this.selectedFiles.filter(file => file !== null) as File[];

      this.productService.updateProduct(this.productId, productData, validFiles, this.imagesToDelete).subscribe({
        next: (product) => {
          this.snackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
          this.router.navigateByUrl(`client/products/${this.productId}`);
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Failed to update product', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields and ensure at least one image', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }

  navigateBack(): void {
    this.router.navigateByUrl('/products');
  }
}
