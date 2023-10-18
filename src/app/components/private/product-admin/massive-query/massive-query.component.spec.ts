import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassiveQueryComponent } from './massive-query.component';

describe('MassiveQueryComponent', () => {
  let component: MassiveQueryComponent;
  let fixture: ComponentFixture<MassiveQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassiveQueryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassiveQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
