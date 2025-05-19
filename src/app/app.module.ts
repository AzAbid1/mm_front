import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideEnvironmentInitializer, inject, NgModule } from '@angular/core';
import { SessionStateService } from './core/services/session-state.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RecommendationService } from './core/services/recommendation.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { NgxLineChartsModule } from 'ngx-simple-charts/line';
import { NgxBarChartsModule } from 'ngx-simple-charts/bar';
import { NgxDonutChartsModule } from 'ngx-simple-charts/donut';
import { NgxDateTimeChartsModule } from 'ngx-simple-charts/date-time';
import { TrendsChartComponent } from './features/client/trends-chart/trends-chart.component';
import { HeaderComponent } from './features/client/components/header/header.component';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgxLineChartsModule,
    NgxBarChartsModule,
    NgxDonutChartsModule,
    NgxDateTimeChartsModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    ReactiveFormsModule,
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
      }),
    RecommendationService,
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }