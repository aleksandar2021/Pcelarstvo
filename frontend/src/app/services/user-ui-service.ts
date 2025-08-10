import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserUiService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': token ? `Bearer ${token}` : '' });
  }

  getUserCalendar(from: string, to: string) {
    const headers = this.authHeaders();
    return this.http.get<{ 
      items: { 
        date: string; 
        status: 'DONE' | 'ASSIGNED_FUTURE' | 'ASSIGNED_PAST';
        tasks: { title: string; description: string }[]
      }[] 
    }>(
      `http://localhost:3000/user/calendar`,
      { headers, params: { from, to } }
    );
  }
}
