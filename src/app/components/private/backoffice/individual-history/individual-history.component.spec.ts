import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualHistoryComponent } from './individual-history.component';

describe('IndividualHistoryComponent', () => {
  let component: IndividualHistoryComponent;
  let fixture: ComponentFixture<IndividualHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
