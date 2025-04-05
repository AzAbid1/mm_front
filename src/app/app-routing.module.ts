import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: "auth",
        loadChildren: () =>
        import("./features/auth/auth.module").then((m) => m.AuthModule)
    },
    {
        path: "client",
        loadChildren: () =>
        import("./features/client/client.module").then((m) => m.ClientModule)
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }