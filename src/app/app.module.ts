import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; //manually typed.
// this is also where you might add an API key if you need one.
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatabasedemoComponent } from './databasedemo/databasedemo.component';
import { HttpClientModule } from '@angular/common/http';  // you needed this.

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    DatabasedemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, // and this too.
    FormsModule, //hand typed.
    ReactiveFormsModule // hand typed.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
