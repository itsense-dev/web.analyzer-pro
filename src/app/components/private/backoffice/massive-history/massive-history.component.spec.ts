import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassiveHistoryComponent } from './massive-history.component';

describe('MassiveHistoryComponent', () => {
  let component: MassiveHistoryComponent;
  let fixture: ComponentFixture<MassiveHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassiveHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassiveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
