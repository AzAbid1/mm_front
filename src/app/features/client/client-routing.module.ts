import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { NonSocialAuthGuard } from '../../core/guards/non-social-auth.guard';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: 'edit-account', component: EditAccountComponent },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [NonSocialAuthGuard]
      },
      { path: 'dashboard', component: DashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
