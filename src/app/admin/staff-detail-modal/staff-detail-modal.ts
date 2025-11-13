

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IStaffRegistration, SignInRecord } from '../../interfaces/staff';

@Component({
  selector: 'app-staff-detail-modal',
  standalone: false,
  templateUrl: './staff-detail-modal.html',
  styleUrl: './staff-detail-modal.css',
})
export class StaffDetailModal {
  staff: IStaffRegistration;

  // Table columns for sign-in history
  displayedColumns: string[] = [
    'date',
    'timeIn',
    'timeOut',
    'hoursWorked',
    'status',
    'lateBy',
    'deduction',
  ];

  // Attendance rate calculation
  attendanceRate: number = 0;

  constructor(
    public dialogRef: MatDialogRef<StaffDetailModal>,
    @Inject(MAT_DIALOG_DATA) public data: { staff: IStaffRegistration }
  ) {
    this.staff = data.staff;
  }

  ngOnInit(): void {
    this.calculateAttendanceRate();
  }

  calculateAttendanceRate(): void {
    const totalDays = this.staff.signInCount || 0;
    const lateDays = this.staff.latenessCount || 0;
    const presentDays = totalDays - lateDays;

    if (totalDays > 0) {
      this.attendanceRate = Math.round((presentDays / totalDays) * 100);
    }
  }

  // Calculate hours worked
  calculateHoursWorked(timeIn: string, timeOut: string | null): string {
    if (!timeOut) return 'N/A';

    const inTime = new Date(`1970-01-01T${timeIn}`);
    const outTime = new Date(`1970-01-01T${timeOut}`);
    const diff = outTime.getTime() - inTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    };
    return date.toLocaleDateString('en-US', options);
  }

  // Format currency
  formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString()}`;
  }

  // Get status icon
  getStatusIcon(status: string): string {
    switch (status) {
      case 'Present':
        return 'check_circle';
      case 'Late':
        return 'schedule';
      case 'Absent':
        return 'cancel';
      default:
        return 'help';
    }
  }

  // Get status class
  getStatusClass(status: string): string {
    switch (status) {
      case 'Present':
        return 'status-present';
      case 'Late':
        return 'status-late';
      case 'Absent':
        return 'status-absent';
      default:
        return '';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}