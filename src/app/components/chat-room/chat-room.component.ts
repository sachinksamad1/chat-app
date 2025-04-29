import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { TypingInfo } from '../../models/typing-info.model';

import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from "../message-input/message-input.component";

@Component({
  selector: 'app-chat-room',
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h2>Chat Room</h2>
        <div class="user-info">
          <span>Logged in as: {{ currentUser?.username }}</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </div>
      
      <!-- <app-message-list 
        [messages]="messages" 
        [currentUser]="currentUser" 
        [typingUsers]="typingUsers">
      </app-message-list> -->

      <app-message-list
        [messages]="messages"
        [currentUser]="currentUser"
        [typingUsers]="typingUsers">
      </app-message-list> 
      
      <app-message-input 
        (messageSent)="sendMessage($event)">
      </app-message-input>

      <app-message-input
      (messageSent)="sendMessage($event)">
      </app-message-input>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 900px;
      margin: 0 auto;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .chat-header h2 {
      margin: 0;
    }
    
    .user-info {
      display: flex;
      align-items: center;
    }
    
    .logout-btn {
      margin-left: 15px;
      padding: 5px 10px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .logout-btn:hover {
      background-color: #c82333;
    }
  `],
  imports: [MessageListComponent, MessageInputComponent]
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  currentUser: User | null = null;
  typingUsers: TypingInfo[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Subscribe to messages
    this.chatService.messages
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
      });

    // Subscribe to typing users
    this.chatService.getTypingUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(typingUsers => {
        // Filter out current user
        this.typingUsers = typingUsers.filter(info => 
          this.currentUser && info.user.id !== this.currentUser.id && info.isTyping
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage(content: string): void {
    this.chatService.sendMessage(content);
  }

  logout(): void {
    this.socketService.disconnect();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}