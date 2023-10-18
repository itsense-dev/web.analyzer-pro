import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassiveQueryDetailComponent } from './massive-query-detail.component';

describe('MassiveQueryDetailComponent', () => {
  let component: MassiveQueryDetailComponent;
  let fixture: ComponentFixture<MassiveQueryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassiveQueryDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassiveQueryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
