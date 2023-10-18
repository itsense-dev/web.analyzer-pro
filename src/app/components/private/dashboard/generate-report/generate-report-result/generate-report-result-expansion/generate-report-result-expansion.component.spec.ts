import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportResultExpansionComponent } from './generate-report-result-expansion.component';

describe('GenerateReportResultExpansionComponent', () => {
  let component: GenerateReportResultExpansionComponent;
  let fixture: ComponentFixture<GenerateReportResultExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateReportResultExpansionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReportResultExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
