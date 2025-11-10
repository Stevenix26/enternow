import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  constructor(private fb: FormBuilder, private router: Router) {}
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
  }

  companyName = String('EnterNow inc.');
  buildForm() {
    this.loginForm = this.fb.group({
      staffId: ['exampleStaffId', [Validators.required]],
      password: [
        'examplePassword',
        [Validators.required, Validators.minLength(8), Validators.maxLength(16)],
      ],
    });
  }

  submitForm() {
    if (this.loginForm.valid) {
      //simulate login login or API call
      const { staffId, password } = this.loginForm.value;
      console.log(this.loginForm.value);

      this.router.navigate(['/admin/home/dashboard']);
    } else {
      this.loginForm.markAllAsTouched();
      console.log('invalid form');
    }
  }
}
