import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { TypingInfo } from '../../models/typing-info.model';
import { CommonModule } from '@angular/common';
import { ScrollToBottomDirective } from '../../directives/scroll-to-bottom.directive';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    ScrollToBottomDirective,
    TimeAgoPipe,
    ScrollToBottomDirective
  ],
  template: `
    <div class="message-list-container" scrollToBottom [scrollToBottom]="messages">
      <div *ngIf="messages.length === 0" class="no-messages">
        No messages yet. Start the conversation!
      </div>
      
      <div *ngFor="let message of messages" 
           class="message-item"
           [ngClass]="{'own-message': isOwnMessage(message)}">
        <div class="message-avatar">
          <img [src]="message.sender.avatar || 'assets/default-avatar.png'" 
               [alt]="message.sender.username" 
               class="avatar-img">
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-sender">{{ message.sender.username }}</span>
            <span class="message-time">{{ message.timestamp | timeAgo }}</span>
          </div>
          <div class="message-text">{{ message.content }}</div>
        </div>
      </div>
      
      <div *ngIf="typingUsers.length > 0" class="typing-indicator">
        <span>
          {{ formatTypingUsers() }}
        </span>
        <div class="dots-container">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .message-list-container {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
    }
    
    .no-messages {
      text-align: center;
      color: #777;
      margin: auto;
    }
    
    .message-item {
      display: flex;
      margin-bottom: 15px;
      align-self: flex-start;
      max-width: 70%;
    }
    
    .own-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    
    .message-avatar {
      flex-shrink: 0;
      margin-right: 10px;
    }
    
    .own-message .message-avatar {
      margin-right: 0;
      margin-left: 10px;
    }
    
    .avatar-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .message-content {
      background-color: #f1f1f1;
      padding: 10px;
      border-radius: 10px;
      position: relative;
    }
    
    .own-message .message-content {
      background-color: #d1e7f7;
    }
    
    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 0.8rem;
    }
    
    .message-sender {
      font-weight: bold;
      color: #333;
    }
    
    .message-time {
      color: #888;
    }
    
    .typing-indicator {
      display: flex;
      align-items: center;
      color: #777;
      font-style: italic;
    }
    
    .dots-container {
      display: flex;
      margin-left: 5px;
    }
    
    .dot {
      width: 6px;
      height: 6px;
      background-color: #777;
      border-radius: 50%;
      margin: 0 2px;
      animation: pulse 1.5s infinite ease-in-out;
    }
    
    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class MessageListComponent implements OnChanges {
  @Input() messages: Message[] = [];
  @Input() currentUser: User | null = null;
  @Input() typingUsers: TypingInfo[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    // Any processing needed when inputs change
  }

  isOwnMessage(message: Message): boolean {
    return this.currentUser !== null && message.sender.id === this.currentUser.id;
  }

  formatTypingUsers(): string {
    if (this.typingUsers.length === 0) {
      return '';
    } else if (this.typingUsers.length === 1) {
      return `${this.typingUsers[0].user.username} is typing`;
    } else if (this.typingUsers.length === 2) {
      return `${this.typingUsers[0].user.username} and ${this.typingUsers[1].user.username} are typing`;
    } else {
      return `${this.typingUsers.length} people are typing`;
    }
  }
}