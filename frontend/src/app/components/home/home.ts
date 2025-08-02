import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  title = 'frontend';
  message = '';

  constructor(private api: Api) {
    this.api.getHello().subscribe(data => {
      this.message = data.message;
    });
  }
}
