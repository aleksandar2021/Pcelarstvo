import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Admin {
  private baseUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': token ? `Bearer ${token}` : '' });
  }

  getTasks(params: {
    from?: string; to?: string; status?: string;
    page?: number; pageSize?: number;
  }) {
    let p = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
    });
    return this.http.get<{ total: number; items: any[] }>(
      `${this.baseUrl}/tasks`,
      { headers: this.authHeaders(), params: p }
    );
  }

  getComments(params: {
    from?: string; to?: string; beekeeperId?: number; taskId?: number;
    page?: number; pageSize?: number;
  }) {
    let p = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
    });
    return this.http.get<{ total: number; items: any[] }>(
      `${this.baseUrl}/comments`,
      { headers: this.authHeaders(), params: p }
    );
  }

  getCompleted(params: {
    from?: string; to?: string; beekeeperId?: number; taskId?: number;
    page?: number; pageSize?: number;
  }) {
    let p = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
    });
    return this.http.get<{ total: number; items: any[] }>(
      `${this.baseUrl}/completed`,
      { headers: this.authHeaders(), params: p }
    );
  }

  getBeekeepers() {
    return this.http.get<{ items: {id:number;username:string;name:string;surname:string}[] }>(
      'http://localhost:3000/admin/users',
      { headers: this.authHeaders() }
    );
  }

  getBeekeeperCalendar(beekeeperId: number, from: string, to: string) {
    const headers = this.authHeaders();
    const params: any = { beekeeperId, from, to };
    return this.http.get<{ items: {date: string; status: 'DONE' | 'ASSIGNED_FUTURE' | 'ASSIGNED_PAST'}[] }>(
      'http://localhost:3000/admin/beeCalendar',
      { headers, params }
    );
  }
}
