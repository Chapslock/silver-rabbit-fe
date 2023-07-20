import {RouterModule, Routes} from '@angular/router';
import {PersonRegistrationFormComponent} from './person-registration-form/person-registration-form.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: PersonRegistrationFormComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
