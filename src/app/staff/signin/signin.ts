import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkSetting } from '../../services/work-setting';
import { IStaffRegistration } from '../../interfaces/staff';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin implements OnInit {
  constructor(private fb: FormBuilder, private workSettings: WorkSetting) {}

  signInForm!: FormGroup; //property declaration for form group

  lateInfo?: { isLate: boolean; minutesLate: number; deduction: number };
  lateDisplay: string = '';

  ngOnInit() {
    //lifecycle hook
    this.buildForm(); //method call to build form

    // Live lateness check
    this.signInForm.get('dateTime')?.valueChanges.subscribe((val: string) => {
      if (!val) {
        this.lateInfo = undefined;
        this.lateDisplay = '';
        return;
      }
      const info = this.workSettings.isLate(val);
      this.lateInfo = info;
      this.lateDisplay = this.workSettings.formatLateTime(info.minutesLate);
    });
  }

  companyName: String = 'EnterNow Inc.'; //property
  showName: boolean = true;
  cars: string[] = ['Volvo', 'Saab', 'Mercedes', 'Audi'];
  userCase: string = 'staff';

  private formatNowForInput(): string {
    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const yyyy = now.getFullYear();
    const MM = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  }

  buildForm() {
    //method to build form
    this.signInForm = this.fb.group({
      staffId: ['exampleStaffId', [Validators.required]],
      password: [
        'examplePassword',
        [Validators.required, Validators.minLength(8), Validators.maxLength(16)],
      ],
      dateTime: [this.formatNowForInput(), [Validators.required]],
    });
  }

  formatCurrency(amount: number): string {
    return `₦${(amount || 0).toLocaleString()}`;
  }

  submitForm() {
    if (this.signInForm.invalid) return;

    const { staffId, dateTime } = this.signInForm.value;

    const raw = localStorage.getItem('registeredStaff');
    if (!raw) {
      alert('No registered staff found. Please register staff first.');
      return;
    }
    const staffArray: IStaffRegistration[] = JSON.parse(raw);
    const idx = staffArray.findIndex((s) => s.staffId === staffId);
    if (idx === -1) {
      alert('Staff ID not found.');
      return;
    }

    const staff = staffArray[idx];
    const lateCheck = this.workSettings.isLate(dateTime);
    const lateByStr = this.workSettings.formatLateTime(lateCheck.minutesLate);

    // Update counters
    staff.signInCount = (staff.signInCount || 0) + 1;
    if (lateCheck.isLate) {
      staff.latenessCount = (staff.latenessCount || 0) + 1;
      staff.totalDeductions = (staff.totalDeductions || 0) + lateCheck.deduction;
      staff.isLate = true;
      staff.status = 'Late';
      staff.lateBy = lateByStr;
      staff.deduction = lateCheck.deduction;
    } else {
      staff.isLate = false;
      staff.status = 'Present';
      staff.lateBy = undefined;
      staff.deduction = 0;
    }

    // Append sign-in record
    const [datePart, timePart] = dateTime.split('T');
    staff.signInHistory = staff.signInHistory || [];
    staff.signInHistory.push({
      id: Date.now().toString(),
      date: datePart,
      timeIn: timePart,
      timeOut: null,
      isLate: lateCheck.isLate,
      deduction: lateCheck.deduction,
      status: lateCheck.isLate ? 'Late' : 'Present',
      lateBy: lateCheck.isLate ? lateByStr : undefined,
    });

    // Update last sign-in
    staff.lastSignIn = dateTime;

    // Persist
    staffArray[idx] = staff;
    localStorage.setItem('registeredStaff', JSON.stringify(staffArray));

    alert(
      lateCheck.isLate
        ? `Signed in late by ${lateByStr}. Deduction: ${this.formatCurrency(lateCheck.deduction)}`
        : 'Signed in successfully on time.'
    );
  }
}
