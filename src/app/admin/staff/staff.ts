import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Admin } from '../../services/admin';
import { MatDialog } from '@angular/material/dialog';
import { IStaff, IStaffRegistration } from '../../interfaces/staff';
import { StaffDetailModal } from '../staff-detail-modal/staff-detail-modal';

export interface StaffElement {
  name: string;
  department: string;
  count: string;
  signin: boolean;
  staffId: string;
}
@Component({
  selector: 'app-staff',
  standalone: false,
  templateUrl: './staff.html',
  styleUrl: './staff.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Staff implements OnInit {
  staffDetails: StaffElement[] = [
    {
      name: 'Tope',
      department: 'Administration',
      count: '4/5',
      signin: true,
      staffId: 'Staff ID 1023',
    },
  ];
  staffDetails2!: IStaff[];
  staffList: IStaffRegistration[] = [];

  staffDisplayView: string[] = ['signInTimes', 'latnessCount', 'Deductions'];

  // Table columns
  displayedColumns: string[] = [
    'staffName',
    'staffId',
    'department',
    'lastSignIn',
    'signInCount',
    'latenessCount',
    'totalDeductions',
    'actions',
  ];

  // Overall statistics
  totalSignIns: number = 0;
  totalLateness: number = 0;
  totalDeductions: number = 0;

  private readonly STORAGE_KEY = 'registeredStaff';

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStaffData();
    this.calculateOverallStats();
  }

  // Load staff from localStorage
  loadStaffData(): void {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        this.staffList = JSON.parse(storedData);

        // Initialize default values if not present
        this.staffList = this.staffList.map((staff) => ({
          ...staff,
          signInCount: staff.signInCount || 0,
          latenessCount: staff.latenessCount || 0,
          totalDeductions: staff.totalDeductions || 0,
          signInHistory: staff.signInHistory || [],
        }));

        console.log('Staff data loaded:', this.staffList);
      }
    } catch (error) {
      console.error('Error loading staff data:', error);
      this.staffList = [];
    }
  }

  // Calculate overall statistics
  calculateOverallStats(): void {
    this.totalSignIns = this.staffList.reduce((sum, staff) => sum + (staff.signInCount || 0), 0);
    this.totalLateness = this.staffList.reduce((sum, staff) => sum + (staff.latenessCount || 0), 0);
    this.totalDeductions = this.staffList.reduce(
      (sum, staff) => sum + (staff.totalDeductions || 0),
      0
    );
  }

  // View staff details (we'll implement this modal next)
  viewStaffDetails(staff: IStaffRegistration): void {
    const dialogRef = this.dialog.open(StaffDetailModal, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { staff: staff },
    });

    // Format currency
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadStaffData();
        this.calculateOverallStats();
      }
    });
  }

  formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString()}`;
  }
}

// constructor(private adminService: Admin) {}

// loadStaffDetails() {
//   this.adminService.getStaff().subscribe((res) => {
//     console.log(res);
//     this.staffDetails2 = res;
//   });
// }
// ngOnInit(): void {
//   this.loadStaffDetails();
// }
