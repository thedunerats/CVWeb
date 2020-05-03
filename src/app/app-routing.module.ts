import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component'; //you need to update this every time you have a new component.
import { DatabasedemoComponent } from './databasedemo/databasedemo.component'; 
import { TrafficsimComponent} from './trafficsim/trafficsim.component';
import { DemopageComponent } from './demopage/demopage.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, //empty component path loads first
  { path: 'app-databasedemo', component: DatabasedemoComponent }, // you have to update this too. Do it manually if you need to.
  { path: 'app-trafficsim', component: TrafficsimComponent },
  { path: 'app-demopage', component: DemopageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
