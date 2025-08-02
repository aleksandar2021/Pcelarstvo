import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  username = '';
  password = '';
  name = '';
  surname = '';
  message = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  register() {
    this.userService.register({
      username: this.username,
      password: this.password,
      name: this.name,
      surname: this.surname
    }).subscribe({
      next: () => {
        this.message = 'Registration successful!';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Registration failed.';
        this.message = '';
      }
    });
  }
}
