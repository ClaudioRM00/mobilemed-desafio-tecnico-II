import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamesList } from './exames-list';

describe('ExamesList', () => {
  let component: ExamesList;
  let fixture: ComponentFixture<ExamesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
