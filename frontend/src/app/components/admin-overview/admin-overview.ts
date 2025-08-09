import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { Admin } from '../../services/admin';
import { MatIconModule } from '@angular/material/icon';

type FiltersForm = {
  from: Date | null;
  to: Date | null;
  status: string;
  beekeeperId: number | null;
  taskId: number | null;
};

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatToolbarModule, MatButtonModule, MatCardModule, MatTabsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule,
    MatIconModule
  ],
  templateUrl: './admin-overview.html',
  styleUrl: './admin-overview.scss'
})
export class AdminOverview implements OnInit {
  constructor(private fb: FormBuilder, private api: Admin, private router: Router) {}

  form!: FormGroup;           
  activeTab = 0;

  tasksCols = ['id','title','start_at','end_at','assignments_total','assignments_done','source_type'];
  tasks = { total: 0, data: [] as any[], page: 1, pageSize: 10, loading: false, error: '' };

  commentsCols = ['id','task_title','author','content','created_at'];
  comments = { total: 0, data: [] as any[], page: 1, pageSize: 10, loading: false, error: '' };

  completedCols = ['assignment_id','task_title','beekeeper','done_at','result_note'];
  completed = { total: 0, data: [] as any[], page: 1, pageSize: 10, loading: false, error: '' };

  @ViewChild('pTasks') pTasks!: MatPaginator;
  @ViewChild('pComments') pComments!: MatPaginator;
  @ViewChild('pCompleted') pCompleted!: MatPaginator;

  ngOnInit(): void {
    this.form = this.fb.group<FiltersForm>({
      from: null,
      to: null,
      status: '',
      beekeeperId: null,
      taskId: null
    } as any);

    this.loadActive();
  }

  tabChanged(idx: number) {
    this.activeTab = idx;
    this.applyFilters(); 
  }

  applyFilters() {
    if (this.activeTab === 0) this.tasks.page = 1;
    if (this.activeTab === 1) this.comments.page = 1;
    if (this.activeTab === 2) this.completed.page = 1;
    this.loadActive(true);
  }

  private fmtDate(d?: Date | null) {
    if (!d) return undefined;
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  pageEvent(kind: 'tasks' | 'comments' | 'completed', pageIndex: number, pageSize: number) {
    if (kind === 'tasks')    { this.tasks.page = pageIndex + 1; this.tasks.pageSize = pageSize; }
    if (kind === 'comments') { this.comments.page = pageIndex + 1; this.comments.pageSize = pageSize; }
    if (kind === 'completed'){ this.completed.page = pageIndex + 1; this.completed.pageSize = pageSize; }
    this.loadActive();
  }

  private loadActive(force = false) {
    if (!this.form) return;

    const { from, to, status, beekeeperId, taskId } = this.form.value as FiltersForm;
    const f = this.fmtDate(from);
    const t = this.fmtDate(to);

    if (this.activeTab === 0) {
      this.tasks.loading = true; this.tasks.error = '';
      this.api.getTasks({
        from: f, to: t,
        status: status || undefined,
        page: this.tasks.page, pageSize: this.tasks.pageSize
      }).subscribe({
        next: (res) => { this.tasks.total = res.total; this.tasks.data = res.items; this.tasks.loading = false; },
        error: (e) => { this.tasks.error = e?.error?.message || 'Failed to load tasks.'; this.tasks.loading = false; }
      });
    }

    if (this.activeTab === 1) {
      this.comments.loading = true; this.comments.error = '';
      this.api.getComments({
        from: f, to: t,
        beekeeperId: beekeeperId ?? undefined,
        taskId: taskId ?? undefined,
        page: this.comments.page, pageSize: this.comments.pageSize
      }).subscribe({
        next: (res) => { this.comments.total = res.total; this.comments.data = res.items; this.comments.loading = false; },
        error: (e) => { this.comments.error = e?.error?.message || 'Failed to load comments.'; this.comments.loading = false; }
      });
    }

    if (this.activeTab === 2) {
      this.completed.loading = true; this.completed.error = '';
      this.api.getCompleted({
        from: f, to: t,
        beekeeperId: beekeeperId ?? undefined,
        taskId: taskId ?? undefined,
        page: this.completed.page, pageSize: this.completed.pageSize
      }).subscribe({
        next: (res) => { this.completed.total = res.total; this.completed.data = res.items; this.completed.loading = false; },
        error: (e) => { this.completed.error = e?.error?.message || 'Failed to load completed.'; this.completed.loading = false; }
      });
    }
  }

  environment(){
    this.router.navigate(['/admin']);
  }

  logout(){
    
  }
}
