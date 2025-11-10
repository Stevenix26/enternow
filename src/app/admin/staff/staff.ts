import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';

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
    {name: 'Tope', department: 'Administration', count: '4/5', signin: true, staffId: 'Staff ID 1023'},
  ];
  ngOnInit(): void {}
}
