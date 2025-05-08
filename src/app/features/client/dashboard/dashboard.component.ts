import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingComponent } from '../components/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ChatMessage {
  content: string;
  isIncoming: boolean;
  isLoading?: boolean;
  isError?: boolean;
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
    LoadingComponent
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
  suggestions = [
    { text: 'Help me plan a game night with my 5 best friends for under $100.', icon: 'draw' },
    { text: 'What are the best tips to improve my public speaking skills?', icon: 'lightbulb' },
    { text: 'Can you help me find the latest news on web development?', icon: 'explore' },
    { text: 'Write JavaScript code to sum all elements in an array.', icon: 'code' }
  ];

  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  private API_KEY = 'PASTE-YOUR-API-KEY'; // Replace with your API key
  private API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      const response = await this.http
        .post(
          this.API_URL,
          {
            contents: [{ role: 'user', parts: [{ text: message.content }] }]
          },
          { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        )
        .toPromise();

      const apiResponse = "response['candidates'][0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1')";
      this.showTypingEffect(apiResponse, message);
    } catch (error: any) {
      this.isResponseGenerating = false;
      message.content = error.error?.message || 'An error occurred';
      message.isError = true;
      message.isLoading = false;
    }
  }

  // Show loading animation
  private showLoadingAnimation(userMessage: string): void {
    const loadingMessage = this.createMessage('', true, true);
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
        this.http.post('http://localhost:8002/generate-image', formData).subscribe({
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
      setTimeout(() => this.showLoadingAnimation(userMessage), 500);

  }

  // Copy message to clipboard
  copyMessage(message: ChatMessage): void {
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
      this.http.post('http://localhost:8002/generate-image', formData).subscribe({
        next: (response: any) => {
          this.responseMessage = response.message;
          this.image = response.image || null;
          this.isLoading = false;
          if (this.loadingComponent) {
            this.loadingComponent.ngOnInit();
          }
        },
        error: (error) => {
          this.responseMessage = `Error: ${error.error.detail || error.message}`;
          this.image = null;
          this.isLoading = false;
          console.error('HTTP Error:', error);
        }
      });
    }
  }
}