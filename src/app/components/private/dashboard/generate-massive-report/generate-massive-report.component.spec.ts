import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMassiveReportComponent } from './generate-massive-report.component';

describe('GenerateMassiveReportComponent', () => {
  let component: GenerateMassiveReportComponent;
  let fixture: ComponentFixture<GenerateMassiveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateMassiveReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateMassiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
