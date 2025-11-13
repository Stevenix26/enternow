import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStaffModal } from './create-staff-modal';

describe('CreateStaffModal', () => {
  let component: CreateStaffModal;
  let fixture: ComponentFixture<CreateStaffModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateStaffModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStaffModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
