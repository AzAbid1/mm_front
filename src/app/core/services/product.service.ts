import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface for Product
export interface Product {
  _id?: string;
  name: string;
  imageFileNames?: string[];
  imageUrls?: string[];
  price: number;
  category: string;
  user: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface for API responses
export interface ApiResponse<T> {
  message: string;
  product?: T;
  products?: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000'; // Backend base URL

  constructor(private http: HttpClient) {}

  // Create a new product
  createProduct(productData: { name: string; price: number; category: string; user: string }, images: File[]): Observable<Product> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('category', productData.category);
    formData.append('user', productData.user);

    // Append up to 5 images
    images.forEach((file, index) => {
      if (index < 5) {
        formData.append('images', file);
      }
    });

    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, formData).pipe(
      map(response => this.transformProduct(response.product!)),
      catchError(this.handleError)
    );
  }

   // Update an existing product
   updateProduct(id: string, productData: { name: string; price: number; category: string }, images?: File[], deleteImages?: string[]): Observable<Product> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('category', productData.category);
    if (deleteImages && deleteImages.length > 0) {
      formData.append('deleteImages', JSON.stringify(deleteImages));
    }

    // Append images if provided
    if (images && images.length > 0) {
      images.forEach((file, index) => {
        if (index < 5) {
          formData.append('images', file);
        }
      });
    }

    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, formData).pipe(
      map(response => this.transformProduct(response.product!)),
      catchError(this.handleError)
    );
  }

  // Delete a product
  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get a single product by ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/getOne/${id}`).pipe(
      map(response => this.transformProduct(response.product!)),
      catchError(this.handleError)
    );
  }

  // Get all products for a user
  getAllProducts(userId: string): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products/getAll/${userId}`).pipe(
      map(response => (response.products || []).map(product => this.transformProduct(product))),
      catchError(this.handleError)
    );
  }

  // Transform product to include absolute image URLs
  private transformProduct(product: Product): Product {
    return {
      ...product,
      imageUrls: product.imageFileNames?.map(filename => `${this.apiUrl}/images/${filename}`) || []
    };
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}