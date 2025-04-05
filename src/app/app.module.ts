import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideEnvironmentInitializer, inject, NgModule } from '@angular/core';
import { SessionStateService } from './core/services/session-state.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
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