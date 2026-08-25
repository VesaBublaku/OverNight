import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const role = localStorage.getItem('overnight_role');
  const staffToken = localStorage.getItem('staff_token');
  const userToken = localStorage.getItem('token');

  const token =
    role === 'admin' || role === 'staff'
      ? staffToken
      : staffToken || userToken;

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
