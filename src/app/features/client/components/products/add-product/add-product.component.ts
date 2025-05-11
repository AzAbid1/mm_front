import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../../../../core/services/session.service';
import { Product, ProductService } from '../../../../../core/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  productForm: FormGroup;
  selectedFiles: File[] = [];
  fileErrors: (string | null)[] = [];

  router = inject(Router);
  productService = inject(ProductService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: [''],
      images: this.fb.array([this.fb.control('')]) // Initialize with one image field
    });
  }

  get imagesFormArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  ngOnInit(): void {
    // Check if user is logged in
    const currentUser = this.sessionService.currentUserSig();
    if (!currentUser) {
      this.snackBar.open('Please log in to add a product', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      this.router.navigateByUrl('/auth/login');
    }
  }

  addImageField(): void {
    if (this.imagesFormArray.length < 5) {
      this.imagesFormArray.push(this.fb.control(''));
      this.fileErrors.push(null);
    }
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.fileErrors[index] = 'Only image files are allowed';
        this.selectedFiles[index] = null as any;
      } else {
        this.fileErrors[index] = null;
        this.selectedFiles[index] = file;
      }
    } else {
      this.fileErrors[index] = null;
      this.selectedFiles[index] = null as any;
    }
    // Filter out null values to count valid files
    this.selectedFiles = this.selectedFiles.filter(file => file !== null);
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFiles.length > 0) {
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
        category: this.productForm.value.category,
        description: this.productForm.value.description,
        user: currentUser._id
      };

      this.productService.createProduct(productData, this.selectedFiles).subscribe({
        next: (product: Product) => {
          this.snackBar.open('Product added successfully!', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
          this.productForm.reset();
          this.imagesFormArray.clear();
          this.imagesFormArray.push(this.fb.control('')); // Reset to one empty field
          this.selectedFiles = [];
          this.fileErrors = [null];
          this.router.navigateByUrl('client/my-products'); // Adjust to your products route
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Failed to add product', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields and select at least one image', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }
}
