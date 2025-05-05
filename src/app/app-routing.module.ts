import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientGuard } from './core/guards/client.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/client/dashboard/dashboard.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
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
    { path: 'client/dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }