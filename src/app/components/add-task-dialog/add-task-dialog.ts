import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.scss'
})
export class AddTaskDialog {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { status: TaskStatus }
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      id: ['', Validators.required],
      description: ['']
    });
  }

  save(): void {
    if (this.taskForm.invalid) return;

    this.dialogRef.close({
      ...this.taskForm.value,
      status: this.data.status
    });
  }
}
