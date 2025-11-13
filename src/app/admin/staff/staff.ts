import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';
import { IStaff } from '../../interfaces/staff';

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

  staffDisplayView: string[] = ['signInTimes', 'latnessCount', 'Deductions'];

  constructor(private adminService: Admin) {}

  loadStaffDetails() {
    this.adminService.getStaff().subscribe((res) => {
      console.log(res);
      this.staffDetails2 = res;
    });
  }
  ngOnInit(): void {
    this.loadStaffDetails();
  }
}
