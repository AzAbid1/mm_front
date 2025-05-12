import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../core/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { PostingTimeService, PostingTimeRequest } from '../../../core/services/posting-time.service';
import { ImagePopupComponent } from './image-popup/image-popup.component';

interface ChatMessage {
  content: string;
  isIncoming: boolean;
  isLoading?: boolean;
  isError?: boolean;
  image?: string;
  facebookPost?: string;
  instagramPost?: string;
  facebookPostingTime?: string;
  instagramPostingTime?: string;
}

interface ApiResponse {
  output: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  imageGenForm: FormGroup;
  chatForm: FormGroup;
  responseMessage: string | null = null;
  image: string | null = null;
  isLoading = false;
  chatMessages: ChatMessage[] = [];
  isResponseGenerating = false;
  isLightMode = false;
  products: Product[] = [];
  suggestions = [
    { name:"product",image: 'https://images.pexels.com/photos/2072158/pexels-photo-2072158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' , text: 'Help me plan a game night with my 5 best friends for under $100.', icon: 'draw' },
    { name:"product",image: 'https://images.pexels.com/photos/2072158/pexels-photo-2072158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',text: 'What are the best tips to improve my public speaking skills?', icon: 'lightbulb' },
    { image: 'https://images.pexels.com/photos/2072158/pexels-photo-2072158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',text: 'Can you help me find the latest news on web development?', icon: 'explore' },
    { image: 'https://images.pexels.com/photos/2072158/pexels-photo-2072158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',text: 'Write JavaScript code to sum all elements in an array.', icon: 'code' } ,
    { image: 'https://images.pexels.com/photos/2072158/pexels-photo-2072158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',text: 'Write JavaScript code to sum all elements in an array.', icon: 'code' }
  ];
  selectedPlatform: 'facebook' | 'instagram' = 'facebook';
  selectedTone: string = 'enthusiastic';
  predictedTime: string | null = null;
  isPredicting = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private postingTimeService: PostingTimeService,
    private dialog: MatDialog
  ) {
    this.imageGenForm = this.fb.group({
      product_name: ['', Validators.required],
      product_desc: ['', Validators.required],
      width: ['512', Validators.required],
      height: ['512', Validators.required],
      seed: ['']
    });

    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDataFromLocalStorage();
    this.loadProduct();
  }

  // Load theme and chat data from local storage
  private loadDataFromLocalStorage(): void {
    const savedChats = localStorage.getItem('saved-chats');
    this.isLightMode = localStorage.getItem('themeColor') === 'light_mode';
    document.body.classList.toggle('light_mode', this.isLightMode);
    console.log('Loaded theme:', this.isLightMode, 'Body has light_mode:', document.body.classList.contains('light_mode'));
    if (savedChats) {
      this.chatMessages = JSON.parse(savedChats);
    }
    this.scrollToBottom();
  }
  // Save chats to local storage
  private saveChatsToLocalStorage(): void {
    localStorage.setItem('saved-chats', JSON.stringify(this.chatMessages));
  }

  // Create a new message
  private createMessage(content: string, isIncoming: boolean, isLoading = false, isError = false): ChatMessage {
    return { content, isIncoming, isLoading, isError };
  }

  // Show typing effect for incoming messages
  private showTypingEffect(text: string, message: ChatMessage): void {
    const words = text.split(' ');
    let currentWordIndex = 0;
    message.content = '';
    const typingInterval = setInterval(() => {
      message.content += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
      if (currentWordIndex === words.length) {
        clearInterval(typingInterval);
        this.isResponseGenerating = false;
        message.isLoading = false;
        this.saveChatsToLocalStorage();
      }
      this.scrollToBottom();
    }, 75);
  }

  // Fetch response from the API
  private async generateAPIResponse(message: ChatMessage): Promise<void> {
    try {
      console.log(message);
      const response = await this.http
        .post<ApiResponse>(
          'http://localhost:8001/PostDescreption',
          { user_description: message.content },
          { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        )
        .toPromise();

      if (response) {
        const content = response.output;
        const facebookMatch = content.match(/\*\*Facebook Post Description:\*\* (.*?)(?=\*\*Instagram Post Description:\*\*|$)/s);
        const instagramMatch = content.match(/\*\*Instagram Post Description:\*\* (.*?)(?=Hashtags:|$)/s);
        
        const cleanFacebookPost = facebookMatch ? facebookMatch[1].trim().replace(/\s*Hashtags:.*$/, '') : '';
        const cleanInstagramPost = instagramMatch ? instagramMatch[1].trim().replace(/\s*Hashtags:.*$/, '') : '';
        
        message.facebookPost = cleanFacebookPost;
        message.instagramPost = cleanInstagramPost;

        // Predict posting times for both platforms
        if (message.facebookPost) {
          this.predictPostingTime('facebook', message);
        }
        if (message.instagramPost) {
          this.predictPostingTime('instagram', message);
        }
        
        const formattedContent = `Facebook Post:\n${message.facebookPost}\n\nInstagram Post:\n${message.instagramPost}`;
        this.showTypingEffect(formattedContent, message);
      }
    } catch (error: any) {
      this.isResponseGenerating = false;
      message.content = error.error?.message || 'An error occurred';
      message.isError = true;
      message.isLoading = false;
    }
  }

  // Show loading animation
  private showLoadingAnimation(userMessage: string): void {
    const loadingMessage = this.createMessage(userMessage, true, true);
    this.chatMessages.push(loadingMessage);
    this.scrollToBottom();
    this.generateAPIResponse(loadingMessage);
  }

  // Handle outgoing chat
  handleOutgoingChat(suggestion?: string): void {
    const userMessage = suggestion || this.chatForm.get('message')?.value?.trim();
    if (!userMessage || this.isResponseGenerating) return;

    this.isResponseGenerating = true;
    const outgoingMessage = this.createMessage(userMessage, false);
    this.chatMessages.push(outgoingMessage);
    this.chatForm.reset();
    this.saveChatsToLocalStorage();
    this.scrollToBottom();

    if (!this.imageGenForm.valid) {
      const formData = this.imageGenForm.value;
      formData.product_name = userMessage;
      formData.product_desc = userMessage;
      console.log(userMessage)
      this.http.post('http://localhost:8002/generate-image', formData).subscribe({
        next: (response: any) => {
          this.responseMessage = response.message;
          this.image = response.image || null;
          if (this.image && this.chatMessages.length > 0) {
            this.chatMessages[this.chatMessages.length - 1].image = this.image;
            this.saveChatsToLocalStorage();
          }
        },
        error: (error) => {
          this.responseMessage = `Error: ${error.error.detail || error.message}`;
          this.image = null;
          console.error('HTTP Error:', error);
        }
      });
    }
    setTimeout(() => this.showLoadingAnimation(userMessage), 100);
  }

  // Copy message to clipboard
  copyMessage(message: ChatMessage | { content: string }): void {
    navigator.clipboard.writeText(message.content);
    // Optionally, show a visual confirmation (e.g., change icon temporarily)
  }

  // Toggle theme
  toggleTheme(): void {
    this.isLightMode = !this.isLightMode;
    console.log('Toggling theme:', this.isLightMode, 'Before toggle, body has light_mode:', document.body.classList.contains('light_mode'));
    document.body.classList.toggle('light_mode', this.isLightMode);
    console.log('After toggle, body has light_mode:', document.body.classList.contains('light_mode'));
    localStorage.setItem('themeColor', this.isLightMode ? 'light_mode' : 'dark_mode');
  }


  // Delete all chats
  deleteChats(): void {
    if (confirm('Are you sure you want to delete all the chats?')) {
      this.chatMessages = [];
      localStorage.removeItem('saved-chats');
      this.loadDataFromLocalStorage();
    }
  }
  
  shareToFacebook(message: ChatMessage): void {
    if (!message.facebookPost) return;

    const shareUrl = 'https://www.facebook.com/sharer/sharer.php';
    const text = `${message.facebookPost}\n\nBest time to post: ${message.facebookPostingTime || 'Not predicted yet'}`;
    const url = `${shareUrl}?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank', 'width=600,height=400');
  }

  shareToInstagram(message: ChatMessage): void {
    if (!message.instagramPost) return;

    // Instagram doesn't have a direct share URL, so we'll copy the content to clipboard
    const text = `${message.instagramPost}\n\nBest time to post: ${message.instagramPostingTime || 'Not predicted yet'}`;
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Content copied! You can now paste it to Instagram', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-success'
      });
    }).catch(() => {
      this.snackBar.open('Failed to copy content', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error'
      });
    });
  }
  // Scroll to bottom of chat list
  private scrollToBottom(): void {
    setTimeout(() => {
      const chatList = document.querySelector('.chat-list');
      if (chatList) {
        chatList.scrollTo(0, chatList.scrollHeight);
      }
    }, 0);
  }

  // Image generation form submission
  onSubmit(): void {
    if (this.imageGenForm.valid) {
      this.isLoading = true;
      const formData = this.imageGenForm.value;
      this.http.post('http://localhost:8005', formData).subscribe({
        next: (response: any) => {
          this.responseMessage = response.message;
          this.image = response.image || null;
         
         
        },
        
        error: (error) => {
          this.responseMessage = `Error: ${error.error.detail || error.message}`;
          this.image = null;
         
          console.error('HTTP Error:', error);
        }
      });
    }
  }

  loadProduct(): void {
    const currentUser = this.sessionService.currentUserSig()
    const productId = currentUser?._id;
    console.log(currentUser);
    console.log(productId);
    if (productId) {
      console.log("aaaaaaaaaaaaa");
      this.productService.getAllProducts(productId).subscribe({
        next: (products) => {
          this.products = products;
          this.suggestions = products.map(product => ({
            image: product.imageUrls?.[0] || 'https://images.pexels.com/photos/2072158/pexels-photo-2072158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            text: ` ${product.description}`,
            name: product.name,
            icon: 'shopping_cart'
          }));
          console.log(this.products);
          // You can use the products data here
          if (this.products.length > 0) {
            this.imageGenForm.patchValue({
              product_name: this.products[0].name,
              product_desc: this.products[0].description
            });
          }
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Failed to load product', 'Close', {
            duration: 3000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  predictPostingTime(platform: 'facebook' | 'instagram', message: ChatMessage): void {
    const request: PostingTimeRequest = {
      platform: platform,
      product: this.products[0]?.name || '',
      tone: 'enthusiastic'
    };

    this.postingTimeService.predictPostingTime(request).subscribe({
      next: (time) => {
        if (platform === 'facebook') {
          message.facebookPostingTime = time;
        } else {
          message.instagramPostingTime = time;
        }
        this.saveChatsToLocalStorage();
      },
      error: (error) => {
        console.error(`Failed to predict ${platform} posting time:`, error);
      }
    });
  }

  openImagePopup(imageUrl: string): void {
    this.dialog.open(ImagePopupComponent, {
      data: { imageUrl },
      width: '600px',
      panelClass: 'image-popup-dialog'
    });
  }
}