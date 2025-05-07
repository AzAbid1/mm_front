import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { NonSocialAuthGuard } from '../../core/guards/non-social-auth.guard';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { ProductsComponent } from './components/products/products/products.component';
import { ProductComponent } from './components/products/product/product.component';
import { ModifyProductComponent } from './components/products/modify-product/modify-product.component';
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
      { path: 'add-product', component: AddProductComponent },
      { path: 'my-products', component: ProductsComponent },
      { path: 'products/:id', component: ProductComponent },
      { path: 'products/edit/:id', component: ModifyProductComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
