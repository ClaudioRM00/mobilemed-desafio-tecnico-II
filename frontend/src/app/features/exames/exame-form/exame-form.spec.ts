import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExameForm } from './exame-form';

describe('ExameForm', () => {
  let component: ExameForm;
  let fixture: ComponentFixture<ExameForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExameForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExameForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
