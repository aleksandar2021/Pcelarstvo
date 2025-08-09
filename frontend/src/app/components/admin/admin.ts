import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GoogleChartsModule } from 'angular-google-charts';
import { PublicAPIService } from '../../services/public-apiservice';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule, RouterModule,
    MatToolbarModule, MatButtonModule, MatCardModule,
    GoogleChartsModule
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

  constructor(private api: PublicAPIService) {}

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
  }

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
}
