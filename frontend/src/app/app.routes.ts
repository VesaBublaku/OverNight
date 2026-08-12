import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChainComponent } from './chain/chain.component';
import {Header} from './header/header';
import {Footer} from './footer/footer';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chains', component: ChainComponent },
  { path: 'header', component: Header },
  { path: 'footer', component: Footer }
];
