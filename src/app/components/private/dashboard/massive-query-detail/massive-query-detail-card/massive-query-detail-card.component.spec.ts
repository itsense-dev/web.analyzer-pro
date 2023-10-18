import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassiveQueryDetailCardComponent } from './massive-query-detail-card.component';

describe('MassiveQueryDetailCardComponent', () => {
  let component: MassiveQueryDetailCardComponent;
  let fixture: ComponentFixture<MassiveQueryDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassiveQueryDetailCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassiveQueryDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
