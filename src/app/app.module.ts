import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './views/home/home.component';
import {ReactiveFormsModule} from '@angular/forms';
import { CardComponent } from './components/card/card.component';
import { ResourceCardComponent } from './components/resource-card/resource-card.component';
import { BookComponent } from './views/book/book.component';
import { HouseComponent } from './views/house/house.component';
import { CharacterComponent } from './views/character/character.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardComponent,
    ResourceCardComponent,
    BookComponent,
    HouseComponent,
    CharacterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
