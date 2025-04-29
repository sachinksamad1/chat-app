import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import io, { Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { TypingInfo } from '../models/typing-info.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private typingUsers = new BehaviorSubject<TypingInfo[]>([]);

  constructor() {
    this.socket = io(environment.socketUrl);
  }

  // Connect to socket server
  connect(user: User): void {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
    this.socket.emit('user-connected', user);
  }

  // Disconnect from socket server
  disconnect(): void {
    this.socket.disconnect();
  }

  // Listen for incoming messages
  onMessage(): Observable<Message> {
    return new Observable(observer => {
      this.socket.on('new-message', (message: Message) => {
        observer.next(message);
      });
    });
  }

  // Send a message
  sendMessage(message: Message): void {
    this.socket.emit('send-message', message);
  }

  // Notify when user starts typing
  startTyping(user: User): void {
    this.socket.emit('typing', { user, isTyping: true });
  }

  // Notify when user stops typing
  stopTyping(user: User): void {
    this.socket.emit('typing', { user, isTyping: false });
  }

  // Listen for typing events
  onTyping(): Observable<TypingInfo[]> {
    return new Observable(observer => {
      this.socket.on('typing-users', (users: TypingInfo[]) => {
        this.typingUsers.next(users);
        observer.next(users);
      });
    });
  }

  // Get current typing users
  getTypingUsers(): Observable<TypingInfo[]> {
    return this.typingUsers.asObservable();
  }

  // Listen for user connection events
  onUserConnected(): Observable<User> {
    return new Observable(observer => {
      this.socket.on('user-connected', (user: User) => {
        observer.next(user);
      });
    });
  }

  // Listen for user disconnection events
  onUserDisconnected(): Observable<User> {
    return new Observable(observer => {
      this.socket.on('user-disconnected', (user: User) => {
        observer.next(user);
      });
    });
  }
}
