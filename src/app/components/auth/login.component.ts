import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  template: `
    <div class="login-container">
      <h2>Chat Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            formControlName="username" 
            placeholder="Enter your username"
            class="form-control" 
            [ngClass]="{'is-invalid': submitted && f['username'].errors}">
          <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
            <div *ngIf="f['username'].errors?.['required']">Username is required</div>
            <div *ngIf="f['username'].errors?.['minlength']">Username must be at least 3 characters</div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="loading">
          <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
          Login
        </button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .btn {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    .btn:hover:not(:disabled) {
      background-color: #0069d9;
    }
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      color: #dc3545;
      margin-top: 5px;
      font-size: 0.875rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/chat']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const username = this.loginForm.get('username')?.value;

    this.authService.login(username).subscribe({
      next: (user) => {
        // Connect to socket with user info
        this.socketService.connect(user);
        this.router.navigate(['/chat']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading = false;
      }
    });
  }
}