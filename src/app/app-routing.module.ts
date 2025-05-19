import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientGuard } from './core/guards/client.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/client/dashboard/dashboard.component';
import { LandingComponent } from './features/landing/landing.component';
import { TrendsChartComponent } from './features/client/trends-chart/trends-chart.component';
const routes: Routes = [
    { path: '', component: LandingComponent },
    {
        path: "auth",
        loadChildren: () =>
        import("./features/auth/auth.module").then((m) => m.AuthModule),
        canActivate: [AuthGuard]
    },
    {
        path: "client",
        loadChildren: () =>
        import("./features/client/client.module").then((m) => m.ClientModule),
        canActivate: [ClientGuard]
    },
    { path: 'client/dashboard', component: DashboardComponent},
    { path: 'client/charts', component: TrendsChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }