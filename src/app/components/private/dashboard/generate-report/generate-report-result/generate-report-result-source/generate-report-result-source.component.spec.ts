import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportResultSourceComponent } from './generate-report-result-source.component';

describe('GenerateReportResultSourceComponent', () => {
  let component: GenerateReportResultSourceComponent;
  let fixture: ComponentFixture<GenerateReportResultSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateReportResultSourceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReportResultSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
