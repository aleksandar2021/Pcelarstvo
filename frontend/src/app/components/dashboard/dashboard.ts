import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatTabsModule }    from '@angular/material/tabs';
import { MatCardModule }    from '@angular/material/card';
import { UserUiService }    from '../../services/user-ui-service';

type DayStatus = 'DONE' | 'ASSIGNED_FUTURE' | 'ASSIGNED_PAST';

interface DayCell {
  date: Date;
  key: string;      // yyyy-MM-dd
  label: string;    // day number
  status?: DayStatus;
  tasks?: { title: string; description: string }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatCardModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  viewMonth = new Date();   // month being viewed
  daysGrid: DayCell[] = []; // 6x7 grid

  loading = false;
  error = '';

  constructor(private api: UserUiService) {}

  ngOnInit(): void {
    this.buildMonthGrid();
    this.loadCalendar();
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  onPrevMonth() {
    this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() - 1, 1);
    this.buildMonthGrid();
    this.loadCalendar();
  }

  onNextMonth() {
    this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + 1, 1);
    this.buildMonthGrid();
    this.loadCalendar();
  }

  private fmtDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private monthBounds(d: Date) {
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const last  = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { from: this.fmtDate(first), to: this.fmtDate(last) };
  }

  private buildMonthGrid() {
    const firstDay = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth(), 1);
    const startDow = (firstDay.getDay() + 6) % 7; // Monday=0
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - startDow);

    const cells: DayCell[] = [];
    for (let i = 0; i < 42; i++) { // 6 weeks
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      cells.push({
        date: d,
        key: this.fmtDate(d),
        label: String(d.getDate()),
        status: undefined,
        tasks: []
      });
    }
    this.daysGrid = cells;
  }

  private loadCalendar() {
    this.loading = true;
    this.error = '';
    const { from, to } = this.monthBounds(this.viewMonth);

    this.api.getUserCalendar(from, to).subscribe({
      next: (res) => {
        const map = new Map(res.items.map(it => [it.date, it]));
        this.daysGrid = this.daysGrid.map(c => {
          const hit = map.get(c.key);
          return hit
            ? { ...c, status: hit.status as DayStatus, tasks: hit.tasks || [] }
            : { ...c, status: undefined, tasks: [] };
        });
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.error?.message || 'Failed to load calendar.';
        this.loading = false;
      }
    });
  }
}
