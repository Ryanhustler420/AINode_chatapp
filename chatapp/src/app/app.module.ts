import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth.module';
import { AuthRoutingModule } from './modules/auth-routing.module';
// import { AuthTabsComponent } from './components/auth-tabs/auth-tabs.component';

@NgModule({
  declarations: [
    AppComponent
    // AuthTabsComponent
  ],
  imports: [BrowserModule, AuthModule, AuthRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
