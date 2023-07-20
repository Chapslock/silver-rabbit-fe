import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionCategorySelectComponent } from './profession-category-select.component';

describe('ProfessionCategorySelectComponent', () => {
  let component: ProfessionCategorySelectComponent;
  let fixture: ComponentFixture<ProfessionCategorySelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessionCategorySelectComponent]
    });
    fixture = TestBed.createComponent(ProfessionCategorySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
