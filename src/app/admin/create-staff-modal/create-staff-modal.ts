import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IStaffRegistration, SignInRecord } from '../../interfaces/staff';
import { WorkSetting } from '../../services/work-setting';

@Component({
  selector: 'app-create-staff-modal',
  standalone: false,
  templateUrl: './create-staff-modal.html',
  styleUrl: './create-staff-modal.css',
})
export class CreateStaffModal implements OnInit {
  staffForm!: FormGroup;
  isLoading = false;
  latenessPreview: string = '';
  deductionPreview: number = 0;
  showPreview: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateStaffModal>,
    private workSettingsService: WorkSetting
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

  ngOnInit(): void {
    const now = new Date();
    const currentDateTime = this.toLocalDateTimeInputValue(now);

    this.staffForm = this.fb.group({
      staffName: ['', Validators.required],
      staffId: ['', Validators.required],
      department: ['', Validators.required],
      dateTime: [currentDateTime, Validators.required],
    });

    // Watch for dateTime changes
    this.staffForm.get('dateTime')?.valueChanges.subscribe((value) => {
      this.updateLatenessPreview(value);
    });

    // Initial check
    this.updateLatenessPreview(currentDateTime);
  }

  updateLatenessPreview(dateTime: string): void {
    if (dateTime) {
      const latenessCheck = this.workSettingsService.isLate(dateTime);
      if (latenessCheck.isLate) {
        this.showPreview = true;
        this.latenessPreview = this.workSettingsService.formatLateTime(latenessCheck.minutesLate);
        this.deductionPreview = latenessCheck.deduction;
      } else {
        this.showPreview = false;
      }
    }
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.isLoading = true;
      const formData = this.staffForm.value;

      // Check lateness
      const latenessCheck = this.workSettingsService.isLate(formData.dateTime);

      // Create sign-in record
      const signInRecord: SignInRecord = {
        id: this.generateId(),
        date: formData.dateTime.split('T')[0],
        timeIn: formData.dateTime.split('T')[1],
        timeOut: null,
        isLate: latenessCheck.isLate,
        lateBy: latenessCheck.isLate
          ? this.workSettingsService.formatLateTime(latenessCheck.minutesLate)
          : undefined,
        deduction: latenessCheck.deduction,
        status: latenessCheck.isLate ? 'Late' : 'Present'
      };

      // Create staff data with sign-in
      const staffData: IStaffRegistration = {
        ...formData,
        signInCount: 1,
        latenessCount: latenessCheck.isLate ? 1 : 0,
        totalDeductions: latenessCheck.deduction,
        signInHistory: [signInRecord]
      };

      console.log('Staff Sign-In Data:', staffData);

      setTimeout(() => {
        this.isLoading = false;
        this.dialogRef.close(staffData);
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private generateId(): string {
    return `signin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString()}`;
  }

  // Format a Date to YYYY-MM-DDTHH:MM in local time for datetime-local inputs
  private toLocalDateTimeInputValue(date: Date): string {
    const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
    return localISOTime;
  }
}