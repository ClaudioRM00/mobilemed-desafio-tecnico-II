import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginatorComponent } from './paginator';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.page).toBe(1);
    expect(component.totalPages).toBe(1);
  });

  it('should emit pageChange event when prev() is called and page > 1', () => {
    component.page = 3;
    component.totalPages = 5;
    spyOn(component.pageChange, 'emit');
    
    component.prev();
    
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange event when prev() is called and page = 1', () => {
    component.page = 1;
    component.totalPages = 5;
    spyOn(component.pageChange, 'emit');
    
    component.prev();
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit pageChange event when next() is called and page < totalPages', () => {
    component.page = 3;
    component.totalPages = 5;
    spyOn(component.pageChange, 'emit');
    
    component.next();
    
    expect(component.pageChange.emit).toHaveBeenCalledWith(4);
  });

  it('should not emit pageChange event when next() is called and page = totalPages', () => {
    component.page = 5;
    component.totalPages = 5;
    spyOn(component.pageChange, 'emit');
    
    component.next();
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should not emit pageChange event when next() is called and page > totalPages', () => {
    component.page = 6;
    component.totalPages = 5;
    spyOn(component.pageChange, 'emit');
    
    component.next();
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should handle edge case when page is 0', () => {
    component.page = 0;
    component.totalPages = 5;
    spyOn(component.pageChange, 'emit');
    
    component.prev();
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should handle edge case when totalPages is 0', () => {
    component.page = 1;
    component.totalPages = 0;
    spyOn(component.pageChange, 'emit');
    
    component.next();
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should handle negative page values', () => {
    component.page = -1;
    component.totalPages = 5;
    spyOn(component.pageChange, 'emit');
    
    component.prev();
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should handle negative totalPages values', () => {
    component.page = 1;
    component.totalPages = -1;
    spyOn(component.pageChange, 'emit');
    
    component.next();
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
