import { Component } from '@angular/core';

export interface StaffElement {
  name: string;
  department: string;
  count: string;
  signin: boolean;
  staffId: string;
}

const staffData: StaffElement[] = [
  {
    name: 'Tope',
    department: 'Administration',
    count: '4/5',
    signin: true,
    staffId: 'Staff ID 1023',
  },
  { name: 'Sayo', department: 'Sales', count: '1/5', signin: true, staffId: 'Staff ID 1023' },
  { name: 'Segun', department: 'Production', count: '2/5', signin: false, staffId: 'Staff ID 1023' },
  {
    name: 'Able',
    department: 'Human Resources',
    count: '4/5',
    signin: true,
    staffId: 'Staff ID 1023',
  },
  { name: 'Janet', department: 'IT', count: '3/5', signin: true, staffId: 'Staff ID 1023' },
];
@Component({
  selector: 'app-signins',
  standalone: false,
  templateUrl: './signins.html',
  styleUrl: './signins.css',
})
export class Signins {
  // column identifiers must match the matColumnDef values in the template
  displayedColumns: string[] = ['s/n', 'name', 'department', 'signin', 'staffId'];
  dataSource = staffData;
}
