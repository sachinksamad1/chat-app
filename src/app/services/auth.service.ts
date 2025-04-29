import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Login method
  login(username: string): Observable<User> {
    return new Observable<User>(observer => {
      const user: User = {
        id: uuidv4(),
        username,
        avatar: this.generateAvatarUrl(username)
      };

      // Store user in local storage
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      observer.next(user);
      observer.complete();
    });
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Generate avatar URL (for simplicity, using initials-based avatar)
  private generateAvatarUrl(username: string): string {
    // For simplicity, we'll use a placeholder with the user's initials
    // In a real app, you might use Gravatar or a proper avatar service
    const initials = username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase();
    
    // Return a data URL with the initials (in a real app, use a proper service)
    const color = this.stringToColor(username);
    return `https://ui-avatars.com/api/?name=${initials}&background=${color.replace('#', '')}&color=fff`;
  }

  // Generate a deterministic color from a string
  private stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }
}