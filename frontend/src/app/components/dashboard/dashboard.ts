import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatCardModule }    from '@angular/material/card';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserUiService }    from '../../services/user-ui-service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type DayStatus = 'DONE' | 'ASSIGNED_FUTURE' | 'ASSIGNED_PAST';

interface DayCell {
  date: Date;
  key: string;
  label: string;
  status?: DayStatus;
  tasks?: { title: string; description: string }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  @ViewChild('calendarCard', { static: false }) calendarCard!: ElementRef;

  viewMonth = new Date();
  daysGrid: DayCell[] = [];
  loading = false;
  error = '';

  constructor(private api: UserUiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.buildMonthGrid();
    this.loadCalendar();
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  async exportPdf() {
    if (!this.calendarCard) return;
    const el = this.calendarCard.nativeElement as HTMLElement;

    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 48;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const y = Math.max(24, (pageHeight - imgHeight) / 2);

    pdf.addImage(imgData, 'PNG', 24, y, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(`calendar-${this.viewMonth.getFullYear()}-${String(this.viewMonth.getMonth()+1).padStart(2,'0')}.pdf`);
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
    const startDow = (firstDay.getDay() + 6) % 7;
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - startDow);

    const cells: DayCell[] = [];
    for (let i = 0; i < 42; i++) {
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
        const map = new Map(res.items.map((it: any) => [it.date, it]));
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

  onDayClick(d: DayCell) {
    const populated = (d.tasks && d.tasks.length > 0) && !!d.status;
    if (!populated) return;

    this.dialog.open(AssignmentDialog, {
      width: '420px',
      data: {
        date: d.key
      }
    });
  }
}

@Component({
  selector: 'app-assignment-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Assignment</h2>
    <div mat-dialog-content>
      <!-- We'll fill details later -->
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `
})
export class AssignmentDialog {
  constructor(
    public dialogRef: MatDialogRef<AssignmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { date: string }
  ) {}
}
