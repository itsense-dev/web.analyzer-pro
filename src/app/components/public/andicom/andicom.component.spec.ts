import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndicomComponent } from './andicom.component';

describe('AndicomComponent', () => {
  let component: AndicomComponent;
  let fixture: ComponentFixture<AndicomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AndicomComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AndicomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
