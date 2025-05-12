import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ClientRoutingModule } from './client-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientComponent } from './client.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { LoadingComponent } from './components/loading/loading.component';
import { MatSelectModule } from '@angular/material/select';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { ModifyProductComponent } from './components/products/modify-product/modify-product.component';
import { ProductComponent } from './components/products/product/product.component';
import { ProductsComponent } from './components/products/products/products.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteDialogComponent } from './components/products/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [
    
    HeaderComponent,
    ClientComponent,
    EditAccountComponent,
    ChangePasswordComponent,
    AddProductComponent,
    ModifyProductComponent,
    ProductComponent,
    ProductsComponent,
    DeleteDialogComponent
   
  ],
  imports: [
    MatSelectModule,
    LoadingComponent,
    CommonModule,
    ClientRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule
  ]
})
export class ClientModule { }
