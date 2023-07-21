import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Person} from '../model/person';
import {PersonRepository} from '../repository/person.repository';
import {ValidationMessage} from '../model/validation-message';
import {ServerErrors} from '../model/server-errors';
import {ServerErrorService} from '../service/server-error.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-person-registration-form',
  templateUrl: './person-registration-form.component.html',
  styleUrls: ['./person-registration-form.component.css']
})
export class PersonRegistrationFormComponent implements OnInit, OnDestroy {
  private static readonly SERVER_ERROR_MAPPING: Record<string, ValidationMessage> = {
    NAME_IS_MANDATORY: {
      controlName: 'name',
      errorMessage: 'Name is mandatory'
    },
    PROFESSION_CATEGORY_IS_MANDATORY: {
      controlName: 'professionCategory',
      errorMessage: 'Choosing a sector is mandatory'
    },
    YOU_HAVE_TO_AGREE_TO_TERMS: {
      controlName: 'hasAgreedToTerms',
      errorMessage: 'You must agree to terms'
    }
  }

  registrationForm!: FormGroup;
  serverErrors: ServerErrors = {};
  personId!: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private personRepository: PersonRepository,
    private serverErrorService: ServerErrorService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      professionCategory: ['', Validators.required],
      hasAgreedToTerms: [false, Validators.requiredTrue],
    });

  }

  get name() {
    return this.registrationForm.get('name');
  }

  get nameErrors() {
    return this.serverErrors['name'];
  }

  get professionCategoryId() {
    return this.registrationForm.get('professionCategory');
  }

  get professionCategoryErrors() {
    return this.serverErrors['professionCategory'];
  }

  get hasAgreedToTerms() {
    return this.registrationForm.get('hasAgreedToTerms');
  }

  get hasAgreedToTermsErrors() {
    return this.serverErrors['hasAgreedToTerms'];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  submitForm(): void {
    if (this.registrationForm.invalid) {
      return;
    }
    this.resetFieldErrors();
    const person: Person = {
      personId: this.personId,
      name: this.name?.value,
      professionCategoryId: this.professionCategoryId?.value,
      hasAgreedToTerms: this.hasAgreedToTerms?.value
    };
    if (!this.personId) {
      this.registerNewPerson(person);
    } else {
      this.updateExistingPerson(person);
    }
  }

  private registerNewPerson(person: Person): void {
    this.subscriptions.push(this.personRepository.registerPerson(person)
      .subscribe(
        (savedPerson) => {
          this.showNotification('Person created succesfully!');
          this.personId = savedPerson.personId;
          this.name?.setValue(savedPerson.name);
          this.professionCategoryId?.setValue(savedPerson.professionCategoryId);
          this.hasAgreedToTerms?.setValue(savedPerson.hasAgreedToTerms);
        },
        (response) => {
          const errorCodes: string[] = response?.error?.errorCodes ?? [];
          this.serverErrors = this.serverErrorService.composeServerErrors(
            errorCodes,
            PersonRegistrationFormComponent.SERVER_ERROR_MAPPING,
          )
        }
      ));
  }

  private resetFieldErrors(): void {
    this.serverErrors = {};
  }

  private updateExistingPerson(person: Person): void {
    this.subscriptions.push(this.personRepository.updatePerson(person)
      .subscribe(
        (savedPerson) => {
          this.showNotification('Person updated succesfully!');
          this.personId = savedPerson.personId;
          this.name?.setValue(savedPerson.name);
          this.professionCategoryId?.setValue(savedPerson.professionCategoryId);
          this.hasAgreedToTerms?.setValue(savedPerson.hasAgreedToTerms);
        },
        (response) => {
          const errorCodes: string[] = response?.error?.errorCodes ?? [];
          this.serverErrors = this.serverErrorService.composeServerErrors(
            errorCodes,
            PersonRegistrationFormComponent.SERVER_ERROR_MAPPING,
          )
        }
      ));
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'close', {
      duration: 5000,
    })
  }
}
