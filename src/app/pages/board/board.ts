import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Router } from '@angular/router';

import { Task, TaskStatus } from '../../models/task.model';
import { AddTaskDialog } from '../../components/add-task-dialog/add-task-dialog';
import { AuthService } from '../../services/auth.spec';

interface BoardData {
  todo: Task[];
  inProgress: Task[];
  needReview: Task[];
  completed: Task[];
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  board: BoardData = {
    todo: [],
    inProgress: [],
    needReview: [],
    completed: [],
  };

  // used by CDK to connect lists for cross-column drag & drop
  connectedLists = ['todo', 'in-progress', 'need-review', 'completed'];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadFromStorage();
  }

  // ---------- ADD TASK ----------
  openAddDialog(status: TaskStatus): void {
    const dialogRef = this.dialog.open(AddTaskDialog, {
      width: '420px',
      data: { status },
    });

    dialogRef.afterClosed().subscribe((task: Task | undefined) => {
      if (task) {
        this.addTask(task);
      }
    });
  }

  addTask(task: Task): void {
    task.createdAt = new Date().toLocaleString();

    switch (task.status) {
      case 'todo':
        this.board.todo.push(task);
        break;
      case 'in-progress':
        this.board.inProgress.push(task);
        break;
      case 'need-review':
        this.board.needReview.push(task);
        break;
      case 'completed':
        this.board.completed.push(task);
        break;
    }

    this.saveToStorage();
  }

  // ---------- DRAG & DROP (between columns) ----------
  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // same column → reorder
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // different column → move & update status
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const newStatus = event.container.id as TaskStatus;
      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = newStatus;
    }

    this.saveToStorage();
  }

  // ---------- STORAGE ----------
  saveToStorage(): void {
    localStorage.setItem('jiraBoard', JSON.stringify(this.board));
  }

  loadFromStorage(): void {
    const raw = localStorage.getItem('jiraBoard');
    if (raw) {
      this.board = JSON.parse(raw);
    }
  }

  // ---------- AUTH ----------
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  trackById(_index: number, task: Task): string {
    return task.id;
  }
}
