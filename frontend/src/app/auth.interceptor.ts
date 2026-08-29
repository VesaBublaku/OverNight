import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userToken = localStorage.getItem('token');
  const staffToken = localStorage.getItem('staff_token');
  const role = localStorage.getItem('overnight_role');

  console.log(' INTERCEPTOR DEBUG ');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Role from localStorage:', role);
  console.log('User token exists:', !!userToken);
  console.log('Staff token exists:', !!staffToken);

  let token = null;

  if (role === 'admin' || role === 'staff') {
    token = staffToken;
    console.log('Using STAFF token for:', req.url);
  } else {
    token = userToken || staffToken;
    console.log('Using USER token for:', req.url);
  }

  if (token) {
    console.log('Token being sent:', token.substring(0, 20) + '...');
    console.log('Authorization header: Bearer ' + token.substring(0, 20) + '...');

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  console.log('No token found for:', req.url);
  return next(req);
};
