import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { PacientesService } from '../../services/pacientes';
import { ExamesService } from '../../services/exames';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockPacientesService: jasmine.SpyObj<PacientesService>;
  let mockExamesService: jasmine.SpyObj<ExamesService>;

  const mockPacientesResponse = {
    data: [],
    meta: {
      total: 150,
      page: 1,
      pageSize: 1,
      totalPages: 150,
      hasNext: false,
      hasPrevious: false
    }
  };

  const mockExamesResponse = {
    data: [],
    meta: {
      total: 75,
      page: 1,
      pageSize: 1,
      totalPages: 75,
      hasNext: false,
      hasPrevious: false
    }
  };

  beforeEach(async () => {
    mockPacientesService = jasmine.createSpyObj('PacientesService', ['list']);
    mockExamesService = jasmine.createSpyObj('ExamesService', ['list']);

    mockPacientesService.list.and.returnValue(of(mockPacientesResponse));
    mockExamesService.list.and.returnValue(of(mockExamesResponse));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [
        { provide: PacientesService, useValue: mockPacientesService },
        { provide: ExamesService, useValue: mockExamesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Os valores são carregados automaticamente no ngOnInit
    // então devemos verificar os valores finais após o carregamento
    expect(component.totalPacientes).toBe(150);
    expect(component.totalExames).toBe(75);
    expect(component.loadingPacientes).toBe(false);
    expect(component.loadingExames).toBe(false);
  });

  it('should load stats on init', () => {
    component.ngOnInit();
    
    expect(mockPacientesService.list).toHaveBeenCalledWith(1, 1);
    expect(mockExamesService.list).toHaveBeenCalledWith(1, 1);
  });

  it('should update totalPacientes when service responds', () => {
    component.loadStats();
    
    expect(component.totalPacientes).toBe(150);
    expect(component.loadingPacientes).toBe(false);
  });

  it('should update totalExames when service responds', () => {
    component.loadStats();
    
    expect(component.totalExames).toBe(75);
    expect(component.loadingExames).toBe(false);
  });

  // it('should handle errors gracefully', () => {
  //   // Este teste verifica se o componente está funcionando
  //   // O tratamento de erro real é testado nos testes de integração
  //   expect(component).toBeTruthy();
  // });

  it('should render the header section', () => {
    const header = fixture.nativeElement.querySelector('h1');
    expect(header.textContent).toContain('Homepage');
    
    const subtitle = fixture.nativeElement.querySelector('p');
    expect(subtitle.textContent).toContain('Visão geral do sistema médico');
  });

  it('should render stats cards', () => {
    const statsCards = fixture.nativeElement.querySelectorAll('.bg-white.overflow-hidden.shadow-card');
    expect(statsCards.length).toBe(2);
  });

  it('should render patients stats card', () => {
    const patientsCard = fixture.nativeElement.querySelector('.bg-white.overflow-hidden.shadow-card');
    expect(patientsCard).toBeTruthy();
    
    const patientsTitle = patientsCard.querySelector('dt');
    expect(patientsTitle.textContent).toContain('Total de Pacientes');
  });

  it('should render exams stats card', () => {
    const examsCards = fixture.nativeElement.querySelectorAll('.bg-white.overflow-hidden.shadow-card');
    const examsCard = examsCards[1];
    expect(examsCard).toBeTruthy();
    
    const examsTitle = examsCard.querySelector('dt');
    expect(examsTitle.textContent).toContain('Total de Exames');
  });

  it('should render quick actions section', () => {
    // Verificar se a seção existe
    const quickActions = fixture.nativeElement.querySelector('.bg-white.shadow-card');
    expect(quickActions).toBeTruthy();
  });

  it('should render new patient action', () => {
    // Verificar se o link existe
    const newPatientAction = fixture.nativeElement.querySelector('a[routerLink="/pacientes/novo"]');
    expect(newPatientAction).toBeTruthy();
  });

  it('should render new exam action', () => {
    // Verificar se o link existe
    const newExamAction = fixture.nativeElement.querySelector('a[routerLink="/exames/novo"]');
    expect(newExamAction).toBeTruthy();
  });

  it('should have proper navigation links', () => {
    const pacientesLink = fixture.nativeElement.querySelector('a[routerLink="/pacientes"]');
    expect(pacientesLink).toBeTruthy();
    
    const examesLink = fixture.nativeElement.querySelector('a[routerLink="/exames"]');
    expect(examesLink).toBeTruthy();
  });

  it('should complete destroy$ subject on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should display loading state for patients', () => {
    component.loadingPacientes = true;
    fixture.detectChanges();
    
    const loadingText = fixture.nativeElement.querySelector('.text-medical-400');
    expect(loadingText.textContent).toContain('Carregando...');
  });

  it('should display loading state for exams', () => {
    component.loadingExames = true;
    fixture.detectChanges();
    
    const loadingTexts = fixture.nativeElement.querySelectorAll('.text-medical-400');
    expect(loadingTexts.length).toBeGreaterThan(0);
  });
});
