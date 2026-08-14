import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('overnight_role') === 'admin';
  if (!isAdmin) {
    router.navigate(['/admin-login']);
    return false;
  }
  return true;
};
