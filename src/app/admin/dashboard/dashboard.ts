import {
  Component,
  OnInit,
  inject,
  Signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateStaffModal } from '../create-staff-modal/create-staff-modal';
import { IStaff, IStaffRegistration } from '../../interfaces/staff';
import { Admin } from '../../services/admin';
import { Router } from '@angular/router';
interface StaffMember {
  name: string;
  department: string;
  count: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  constructor(
    private adminService: Admin,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  // LocalStorage key
  private readonly STORAGE_KEY = 'registeredStaff';

  name: string = 'Steven';

  filter: string[] = ['All', 'Active', 'Inactive'];

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

  // Combined staff and department into a single array of objects
  staffList: StaffMember[] = [
    { name: 'Tope', department: 'Administration', count: '4/5' },
    { name: 'Sayo', department: 'Sales', count: '1/5' },
    { name: 'Segun', department: 'Production', count: '2/5' },
    { name: 'Able', department: 'Human Resources', count: '4/5' },
    { name: 'Janet', department: 'IT', count: '3/5' },
  ];
  staffDetails: IStaffRegistration[] = [];
  // Define table columns
  displayedColumns: string[] = ['staffName', 'staffId', 'department', 'dateTime'];
  // showModal = false;
  // showMessage = false;

  // openModal() {
  //   this.showModal = true;
  // }

  // closeModal() {
  //   this.showModal = false;
  // }

  // staffDetails = {
  //   StaffID: '',
  //   Department: '',
  //   Email: '',
  //   signedInTme: '',
  //   signedOutTime: '',
  // };

  openCreateStaffModal() {
    const dialogRef = this.dialog.open(CreateStaffModal, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Check if staff already exists
        const existingStaffIndex = this.staffDetails.findIndex(
          (staff) => staff.staffId === result.staffId
        );
        if (existingStaffIndex !== -1) {
          // Staff exists - add to their sign-in history
          const existingStaff = this.staffDetails[existingStaffIndex];

          // Update sign-in history
          if (!existingStaff.signInHistory) {
            existingStaff.signInHistory = [];
          }
          existingStaff.signInHistory.unshift(result.signInHistory[0]);

          // Update counts
          existingStaff.signInCount = (existingStaff.signInCount || 0) + 1;
          existingStaff.latenessCount = (existingStaff.latenessCount || 0) + result.latenessCount;
          existingStaff.totalDeductions =
            (existingStaff.totalDeductions || 0) + result.totalDeductions;

          // Update the array to trigger change detection
          this.staffDetails = [...this.staffDetails];

          console.log('Updated existing staff:', existingStaff);
        } else {
          // New staff - add to list
          this.staffDetails = [...this.staffDetails, result];
          console.log('Added new staff:', result);
        }

        // this.staffDetails = [...this.staffDetails, result]; // This triggers change detection
        this.saveStaffToLocalStorage();
        this.cdr.markForCheck();
        this.router.navigate(['/admin/home/staff']);
        console.log('Updated Staff Details:', this.staffDetails);
      }
    });
  }
  // Format the datetime string for display
  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return 'N/A';

    const date = new Date(dateTimeString);

    // Format: "Dec 15, 2024 at 2:30 PM"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    return date.toLocaleString('en-US', options);
  }

  // Save staff data to localStorage
  private saveStaffToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.staffDetails));
      console.log('Staff data saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Load staff data from localStorage
  private loadStaffFromLocalStorage(): void {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        this.staffDetails = JSON.parse(storedData);
        console.log('Staff data loaded from localStorage:', this.staffDetails);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.staffDetails = [];
    }
  }

  // Optional: Clear all staff data (useful for testing or reset functionality)
  clearAllStaff(): void {
    if (confirm('Are you sure you want to clear all staff data?')) {
      this.staffDetails = [];
      localStorage.removeItem(this.STORAGE_KEY);
      this.cdr.markForCheck();
      console.log('All staff data cleared');
    }
  }

  // constructor() {}

  // Function to get a random staff member and department
  // getRandomStaff(): StaffMember {
  //   const randomIndex = Math.floor(Math.random() * this._staff.length);
  //   return {
  //     name: this._staff[randomIndex],
  //     department: this._departments[randomIndex],
  //   };
  // }

  // Keep original arrays for other uses if needed
  private _staff = ['Tope', 'Sayo', 'Segun', 'Able', 'Janet'];
  private _departments = [
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
    this.loadStaffFromLocalStorage();
  }
}
