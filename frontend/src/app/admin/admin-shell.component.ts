import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex bg-[#FAF8F5]">

      <!-- Sidebar -->
      <aside class="w-64 shrink-0 flex flex-col bg-white border-r border-gray-100 min-h-screen shadow-[2px_0_16px_rgb(0,0,0,0.03)]">

        <!-- Logo -->
        <div class="h-20 flex items-center px-8 border-b border-gray-100">
          <a routerLink="/" class="flex items-baseline gap-2">
            <span class="text-gray-900 text-2xl font-serif tracking-tight">LuxStay</span>
            <span class="text-gray-400 text-[9px] font-semibold tracking-[0.2em] uppercase">Admin</span>
          </a>
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-4 py-6 space-y-1">
          <div class="text-[9px] font-semibold text-gray-400 tracking-[0.25em] uppercase px-4 mb-3">Management</div>

          <a routerLink="/admin/hotels" routerLinkActive="bg-[#FAF5EF] text-gray-900 border border-[#E8E3DB]"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-[#FAF8F5] text-sm font-medium transition-colors">
            <svg class="w-4 h-4 text-[#BCA47B]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
            Hotels & Rooms
          </a>

          <a routerLink="/admin/hotel-chains" routerLinkActive="bg-[#FAF5EF] text-gray-900 border border-[#E8E3DB]"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-[#FAF8F5] text-sm font-medium transition-colors">
            <svg class="w-4 h-4 text-[#BCA47B]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Hotel Chains
          </a>
          
          <a routerLink="/admin/people" routerLinkActive="bg-[#FAF5EF] text-gray-900 border border-[#E8E3DB]"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-[#FAF8F5] text-sm font-medium transition-colors">
            <svg class="w-4 h-4 text-[#BCA47B]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            Staff & Customers
          </a>

          <div class="text-[9px] font-semibold text-gray-400 tracking-[0.25em] uppercase px-4 mt-6 mb-3">Quick Links</div>

          <a routerLink="/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-[#FAF8F5] text-sm font-medium transition-colors">
            <svg class="w-4 h-4 text-[#BCA47B]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Back to Site
          </a>
        </nav>

        <!-- User + Logout -->
        <div class="px-4 py-6 border-t border-gray-100">
          <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAF5EF] border border-[#E8E3DB] mb-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#D9BE84] to-[#BCA47B] flex items-center justify-center shrink-0">
              <span class="text-white text-xs font-serif font-bold">A</span>
            </div>
            <div>
              <div class="text-gray-900 text-xs font-medium">Admin</div>
              <div class="text-gray-400 text-[10px]">Superuser</div>
            </div>
          </div>
          <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 text-sm font-medium transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
})
export class AdminShellComponent {
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('overnight_role');
    this.router.navigate(['/admin-login']);
  }
}
