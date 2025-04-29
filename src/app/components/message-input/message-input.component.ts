import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule
  ], 
  template: `
    <div class="message-input-container">
      <form [formGroup]="messageForm" (ngSubmit)="sendMessage()">
        <div class="input-group">
          <input 
            type="text" 
            formControlName="messageContent" 
            placeholder="Type a message..." 
            class="form-control"
            (keyup)="onTyping()"
            (keyup.enter)="sendMessage()">
          <button 
            type="submit" 
            class="send-button" 
            [disabled]="!messageForm.valid">
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .message-input-container {
      padding: 15px;
      border-top: 1px solid #e0e0e0;
      background-color: #f8f9fa;
    }
    
    .input-group {
      display: flex;
    }
    
    .form-control {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
      outline: none;
    }
    
    .send-button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
    }
    
    .send-button:hover:not(:disabled) {
      background-color: #0069d9;
    }
    
    .send-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class MessageInputComponent implements OnInit {
  @Output() messageSent = new EventEmitter<string>();
  messageForm: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService
  ) {
    this.messageForm = this.formBuilder.group({
      messageContent: ['', [Validators.required]]
    });
  }
  
  ngOnInit() {}
  
  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }
    
    const content = this.messageForm.get('messageContent')?.value.trim();
    if (content) {
      this.messageSent.emit(content);
      this.messageForm.reset();
    }
  }
  
  onTyping(): void {
    this.chatService.startTyping();
  }
}