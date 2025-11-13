import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IStaffRegistration } from '../../interfaces/staff';

@Component({
  selector: 'app-create-staff-modal',
  standalone: false,
  templateUrl: './create-staff-modal.html',
  styleUrl: './create-staff-modal.css',
})
export class CreateStaffModal implements OnInit {
  staffForm!: FormGroup;
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateStaffModal>
  ) {}
  department: string[] = [
    'Administration',
    'Sales',
    'Production',
    'Human Resources',
    'Accounting',
    'Procurement',
    'Legal',
    'IT',
  ];

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.isLoading = true;
      const formData: IStaffRegistration = this.staffForm.value;
      console.log('Form Data:', formData);


      setTimeout(() => {
        this.isLoading
        this.dialogRef.close(formData);
      },1000)
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      staffName: ['', Validators.required],
      staffId: ['', Validators.required],
      department: ['', Validators.required],
      dateTime: ['', Validators.required],
    });
  }
}
