import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportResultComponent } from './generate-report-result.component';

describe('GenerateReportResultComponent', () => {
  let component: GenerateReportResultComponent;
  let fixture: ComponentFixture<GenerateReportResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateReportResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReportResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
