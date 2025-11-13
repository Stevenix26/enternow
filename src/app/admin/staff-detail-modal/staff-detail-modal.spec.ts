import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDetailModal } from './staff-detail-modal';

describe('StaffDetailModal', () => {
  let component: StaffDetailModal;
  let fixture: ComponentFixture<StaffDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
