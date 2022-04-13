import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateRegistrationOtpComponent } from './validate-registration-otp.component';

describe('ValidateRegistrationOtpComponent', () => {
  let component: ValidateRegistrationOtpComponent;
  let fixture: ComponentFixture<ValidateRegistrationOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateRegistrationOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateRegistrationOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
