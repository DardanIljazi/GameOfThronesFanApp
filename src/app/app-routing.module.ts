import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {LoginGuard} from './guards/login/login.guard';
import {CharacterComponent} from './views/character/character.component';
import {HouseComponent} from './views/house/house.component';
import {BookComponent} from './views/book/book.component';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [LoginGuard],
    component: HomeComponent
  },
  {
    path: 'character/:id',
    canActivate: [LoginGuard],
    component: CharacterComponent
  },
  {
    path: 'house/:id',
    canActivate: [LoginGuard],
    component: HouseComponent
  },
  {
    path: 'book/:id',
    canActivate: [LoginGuard],
    component: BookComponent
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
