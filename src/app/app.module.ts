import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; //manually typed.
// this is also where you might add an API key if you need one.
// don't forget to update the imports here when you install a new dependency.
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatabasedemoComponent } from './databasedemo/databasedemo.component';
import { HttpClientModule } from '@angular/common/http';
import { TrafficsimComponent } from './trafficsim/trafficsim.component';  // you needed this.
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DndModule } from 'ngx-drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    DatabasedemoComponent,
    TrafficsimComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, // and this too.
    FormsModule, //hand typed.
    ReactiveFormsModule, // hand typed.
    DragDropModule,
    DndModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
