import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProfessionCategory} from '../model/profession-category';
import {ProfessionCategoryOption} from '../model/profession-category-option';
import {FormGroup} from '@angular/forms';
import {ProfessionCategoryRepository} from '../repository/profession-category.repository';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profession-category-select',
  templateUrl: './profession-category-select.component.html',
  styleUrls: ['./profession-category-select.component.css']
})
export class ProfessionCategorySelectComponent implements OnInit, OnDestroy {

  @Input() form!: FormGroup;

  professionCategories: ProfessionCategory[] = [];
  professionCategoryOptions: ProfessionCategoryOption[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private professionCategoryRepository: ProfessionCategoryRepository,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.professionCategoryRepository.findAllProfessions()
        .subscribe(professionCategories => {
          this.professionCategories = professionCategories;
          this.composeLabels();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get professionCategoryId() {
    return this.form.get('professionCategory');
  }

  private composeLabels(): void {
    this.professionCategories.forEach(profession => {
      this.professionCategoryOptions.push({
        id: profession.id,
        label: this.getOptionLabel(profession)
      })
    });
    this.professionCategoryOptions.sort((a, b) => a.label.localeCompare(b.label));
  }

  getOptionLabel(option: ProfessionCategory): string {
    let label = option.name;
    let parent = this.getParent(option.parentId);
    while (parent) {
      label = parent.name + ' -> ' + label;
      parent = this.getParent(parent.parentId);
    }
    return label;
  }

  getParent(parentId: number | undefined): ProfessionCategory | undefined {
    return this.professionCategories.find(option => option.id === parentId);
  }

}
