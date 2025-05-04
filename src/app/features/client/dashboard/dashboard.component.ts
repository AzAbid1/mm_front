import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoadingComponent } from '../components/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',  
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    LoadingComponent
],
  templateUrl: './dashboard.component.html', 
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
  imageGenForm: FormGroup;
  responseMessage: string | null = null;
  image: string | null = null;
  isLoading = false;

  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  constructor(private fb: FormBuilder, private http: HttpClient) {
      this.imageGenForm = this.fb.group({
          product_name: ['', Validators.required],
          product_desc: ['', Validators.required],
          text_model: ['openai', Validators.required],
          image_model: ['flux', Validators.required],
          width: ['1080', Validators.required],
          height: ['1080', Validators.required],
          seed: ['']
      });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.imageGenForm.valid) {
        console.log('Starting request, isLoading:', this.isLoading); // Debug
        this.isLoading = true;
        console.log('After setting isLoading, isLoading:', this.isLoading); // Debug
        const formData = this.imageGenForm.value;
        this.http.post('http://localhost:8002/generate-image', formData).subscribe({
            next: (response: any) => {
                console.log('Response received, isLoading:', this.isLoading); // Debug
                console.log(response)
                this.responseMessage = response.message;
                this.image = response.image || null;
                this.isLoading = false;
                console.log('After response, isLoading:', this.isLoading); // Debug
                if (this.loadingComponent) {
                    this.loadingComponent.ngOnInit();
                }
            },
            error: (error) => {
                console.log('Error received, isLoading:', this.isLoading); // Debug
                this.responseMessage = `Error: ${error.error.detail || error.message}`;
                this.image = null;
                this.isLoading = false;
                console.error('HTTP Error:', error);
            }
        });
    }
}
}
