import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GoogleChartsModule } from 'angular-google-charts';
import { PublicAPIService } from '../../services/public-apiservice';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Admin as AdminService } from '../../services/admin';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

type DayStatus = 'DONE' | 'ASSIGNED_FUTURE' | 'ASSIGNED_PAST';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatToolbarModule, MatButtonModule, MatCardModule,
    GoogleChartsModule, MatSelectModule, MatFormFieldModule,
    MatIconModule, MatDatepickerModule, MatTabsModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  // Belgrade latitude and longitude
  lat = 44.8;
  lon = 20.47;
  daysWeather = 7;
  daysAQ = 7;

  loadingWeather = false;
  loadingAQ = false;
  weatherError = '';
  aqError = '';

  beekeepers: { id: number; username: string; name: string; surname: string }[] = [];
  selectedBeekeeperId: number | null = null;
  selectedTaskId: number | null = null;
  futureTasks: any[] = [];

  newTask = {
    title: '',
    description: '',
    start_at: null,
    end_at: null
  };

  assignMessage = '';
  
  viewMonth = new Date();
  daysGrid: { date: Date; label: string; key: string; status?: DayStatus; descriptions?: string[]; }[] = [];

  constructor(private api: PublicAPIService, private adminAPI: AdminService) {}

  weatherChart: any = {
    chartType: 'LineChart',
    columns: ['Date', 'T max (°C)', 'T min (°C)'],
    data: [],
    options: {
      legend: { position: 'bottom' },
      height: 320,
      chartArea: { width: '85%', height: '70%' },
      hAxis: { format: 'MM-dd', slantedText: true, slantedTextAngle: 45 },
      vAxis: { title: '°C' },
      colors: ['#d32f2f', '#1976d2']
    }
  };

  airChart: any = {
    chartType: 'LineChart',
    columns: ['Time', 'O₃ (µg/m³)', 'CO (µg/m³)', 'PM2.5 (µg/m³)'],
    data: [],
    options: {
      legend: { position: 'bottom' },
      height: 320,
      chartArea: { width: '85%', height: '70%' },
      hAxis: { format: 'MM-dd HH:mm', showTextEvery: 6, slantedText: true, slantedTextAngle: 45 },
      vAxis: { title: 'µg/m³', viewWindow: { min: 0 } }
    }
  };

  ngOnInit() {
    this.loadWeather();
    this.loadAQ();
    this.buildMonthGrid();   
    this.loadBeekeepers();  
    this.futureTasks = [
      { id: 101, title: 'Inspect hive #5', start_at: new Date('2025-08-15'), end_at: new Date('2025-08-16') },
      { id: 102, title: 'Honey extraction', start_at: new Date('2025-08-20'), end_at: new Date('2025-08-22') }
    ];  
  }

  // ------- Weather & AQ -------
  loadWeather() {
    this.loadingWeather = true;
    this.weatherError = '';
    this.api.getForecast(this.lat, this.lon, this.daysWeather, 'Europe/Belgrade')
      .subscribe({
        next: (res) => {
          const rows = (res?.data?.data ?? []).map((d: any) => {
            const dt = new Date(d.date);
            return [dt, Number(d.tmax ?? 0), Number(d.tmin ?? 0)];
          });
          this.weatherChart = { ...this.weatherChart, data: rows };
          this.loadingWeather = false;
        },
        error: (err) => {
          this.weatherError = err?.error?.message || 'Failed to load weather.';
          this.loadingWeather = false;
        }
      });
  }

  loadAQ() {
    this.loadingAQ = true;
    this.aqError = '';
    this.api.getAirQuality(this.lat, this.lon, this.daysAQ, 'Europe/Belgrade')
      .subscribe({
        next: (res) => {
          const hours = res?.data?.hours ?? [];
          const rows = hours.map((h: any) => [
            new Date(h.time),
            h.ozone ?? null,
            h.carbon_monoxide ?? null,
            h.pm2_5 ?? null
          ]);
          this.airChart = { ...this.airChart, data: rows };
          this.loadingAQ = false;
        },
        error: (err) => {
          this.aqError = err?.error?.message || 'Failed to load air quality.';
          this.loadingAQ = false;
        }
      });
  }

  // ------- Beekeepers & Calendar -------
  loadBeekeepers() {
    this.adminAPI.getBeekeepers().subscribe({
      next: (res) => {
        this.beekeepers = res.items || [];
        if (!this.selectedBeekeeperId && this.beekeepers.length) {
          this.selectedBeekeeperId = this.beekeepers[0].id;
          this.loadCalendar();
        }
      },
      error: (e) => console.error('beekeepers load error', e)
    });
  }

  onBeekeeperSelected() {
    this.loadCalendar();
  }

  onPrevMonth() {
    this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() - 1, 1);
    this.buildMonthGrid(); 
  }

  onNextMonth() {
    this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + 1, 1);
    this.buildMonthGrid(); 
  }

  private monthBounds(d: Date) {
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const last  = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const fmt = (x: Date) => `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
    return { from: fmt(first), to: fmt(last) };
  }

  private buildMonthGrid() {
    const firstDay = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth(), 1);
    const startDow = (firstDay.getDay() + 6) % 7; 
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - startDow);

    const cells: { date: Date; key: string; label: string; status?: DayStatus }[] = [];
    for (let i = 0; i < 42; i++) { 
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      cells.push({ date: d, key, label: String(d.getDate()) });
    }
    this.daysGrid = cells;

    
    if (this.selectedBeekeeperId) {
      this.loadCalendar();
    }
  }

  private loadCalendar() {
    if (!this.selectedBeekeeperId) return;
    const { from, to } = this.monthBounds(this.viewMonth);
    this.adminAPI.getBeekeeperCalendar(this.selectedBeekeeperId, from, to)
      .subscribe({
        next: (res) => {
          debugger;
          const map = new Map(res.items.map(x => [x.date, x]));
          this.daysGrid = this.daysGrid.map(c => {
            const hit = map.get(c.key);
            return hit ? { ...c, status: hit.status as DayStatus, descriptions: hit.descriptions || [] }
                      : { ...c, status: undefined, descriptions: [] };
          });
        },
        error: (e) => console.error('calendar error', e)
      });
  }

  assignTask() {
    if (this.selectedTaskId) {
      this.assignMessage = `Assigned existing task ID ${this.selectedTaskId} to beekeeper ${this.selectedBeekeeperId}`;
    } else {
      this.assignMessage = `Created new task "${this.newTask.title}" and assigned to beekeeper ${this.selectedBeekeeperId}`;
    }
  }
}
