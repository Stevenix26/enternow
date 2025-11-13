import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { Staff } from './staff/staff';
import { Signins } from './signins/signins';
import { Report } from './report/report';
import { Login } from './login/login';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material-module';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { AdminSideNav } from './layout/admin-side-nav/admin-side-nav';
import { AdminHeader } from './layout/admin-header/admin-header';
import { CreateStaffModal } from './create-staff-modal/create-staff-modal';
import { StaffDetailModal } from './staff-detail-modal/staff-detail-modal';

@NgModule({
  declarations: [Dashboard, Staff, Signins, Report, Login, AdminLayout, AdminSideNav, AdminHeader, CreateStaffModal, StaffDetailModal],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule, MaterialModule],
})
export class AdminModule {}
