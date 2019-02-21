import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth.module';
import { AuthRoutingModule } from './modules/auth-routing.module';
// import { StreamsComponent } from './components/streams/streams.component';
import { StreamsModule } from './modules/streams.module';
import { StreamsRoutingModule } from './modules/streams-routing.module';
// import { AuthTabsComponent } from './components/auth-tabs/auth-tabs.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent
    // StreamsComponent
    // AuthTabsComponent
  ],
  imports: [BrowserModule, AuthModule, AuthRoutingModule, StreamsModule, StreamsRoutingModule],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {}
