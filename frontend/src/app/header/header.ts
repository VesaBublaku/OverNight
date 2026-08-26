import { Component } from '@angular/core';
import {RouterLink, RouterModule} from "@angular/router";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header',
    imports: [
        RouterLink,
      CommonModule,
      RouterModule
    ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
