import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientComponent } from './client.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    ClientComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    MatSidenavModule,
    MatButtonModule, // For navigation buttons
    MatMenuModule,    // For dropdown menu
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
  ]
})
export class ClientModule { }
