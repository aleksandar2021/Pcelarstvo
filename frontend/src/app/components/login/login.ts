import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private userService: UserService, private router: Router){}

  login() {
    this.userService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.errorMessage = '';
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        if (res.role == 'administrator'){
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);     
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Login failed.';
      }
    });
  }

  register() {
    this.router.navigate(['/register']);    
  }
}
