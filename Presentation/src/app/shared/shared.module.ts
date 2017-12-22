import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "app/app-routing.module";

import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
  ]
})
export class SharedModule { }
