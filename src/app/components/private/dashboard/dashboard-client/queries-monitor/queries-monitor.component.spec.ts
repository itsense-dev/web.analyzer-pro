import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueriesMonitorComponent } from './queries-monitor.component';

describe('QueriesMonitorComponent', () => {
  let component: QueriesMonitorComponent;
  let fixture: ComponentFixture<QueriesMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueriesMonitorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueriesMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
