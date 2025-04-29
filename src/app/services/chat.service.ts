import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { TypingInfo } from '../models/typing-info.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages = this.messagesSubject.asObservable();
  private typingTimeout: any;

  constructor(
    private socketService: SocketService,
    private authService: AuthService
  ) {
    // Initialize message listener
    this.socketService.onMessage().subscribe(message => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
      this.notifyNewMessage(message);
    });
  }

  // Send a new message
  sendMessage(content: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !content.trim()) return;

    const message: Message = {
      id: uuidv4(),
      content: content.trim(),
      sender: currentUser,
      timestamp: new Date()
    };

    // Add message to local state
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);

    // Send message through socket
    this.socketService.sendMessage(message);
    
    // Stop typing indicator
    this.stopTyping();
  }

  // Notify that user is typing
  startTyping(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Clear previous timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Send typing event
    this.socketService.startTyping(currentUser);

    // Set timeout to stop typing after 2 seconds of inactivity
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 2000);
  }

  // Stop typing notification
  stopTyping(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    // Clear timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    // Send stop typing event
    this.socketService.stopTyping(currentUser);
  }

  // Get typing users
  getTypingUsers(): Observable<TypingInfo[]> {
    return this.socketService.getTypingUsers();
  }

  // Desktop notification for new message
  private notifyNewMessage(message: Message): void {
    const currentUser = this.authService.getCurrentUser();
    
    // Only notify for messages from others
    if (currentUser && message.sender.id !== currentUser.id && 'Notification' in window) {
      // Check if we have permission
      if (Notification.permission === 'granted') {
        this.createNotification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.createNotification(message);
          }
        });
      }
    }
  }

  // Create a notification
  private createNotification(message: Message): void {
    const notification = new Notification('New Message', {
      body: `${message.sender.username}: ${message.content}`,
      icon: message.sender.avatar || 'assets/notification-icon.png'
    });

    // Close notification after 4 seconds
    setTimeout(() => {
      notification.close();
    }, 4000);

    // Focus window when notification is clicked
    notification.onclick = function() {
      window.focus();
      notification.close();
    };
  }
}