import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmpresaComponent } from "./components/empresa/empresa.component";
import { EmpresasComponent } from "./components/empresas/empresas.component";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "empresas", component: EmpresasComponent },
  { path: "empresas/:nombre", component: EmpresaComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
