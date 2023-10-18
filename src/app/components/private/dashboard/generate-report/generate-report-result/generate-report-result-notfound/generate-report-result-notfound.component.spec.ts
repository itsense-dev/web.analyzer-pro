import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportResultNotfoundComponent } from './generate-report-result-notfound.component';

describe('GenerateReportResultNotfoundComponent', () => {
  let component: GenerateReportResultNotfoundComponent;
  let fixture: ComponentFixture<GenerateReportResultNotfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateReportResultNotfoundComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReportResultNotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
