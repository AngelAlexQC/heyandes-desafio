import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { EmpresasComponent } from "./components/empresas/empresas.component";
import { EmpresaComponent } from "./components/empresa/empresa.component";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [AppComponent, HomeComponent, EmpresasComponent, EmpresaComponent],
  imports: [BrowserModule, AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
