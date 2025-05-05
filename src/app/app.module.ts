import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideEnvironmentInitializer, inject, NgModule } from '@angular/core';
import { SessionStateService } from './core/services/session-state.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [
    provideHttpClient(),
    provideEnvironmentInitializer((sessionStateService: SessionStateService = inject(SessionStateService)) => {
        sessionStateService.initializeSession();
      })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }