import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (req.url.includes('/auth/refresh-token')) {
          authService.logout();
          router.navigate(['/auth/login']);
          return throwError(() => error);
        }
        return authService.refreshToken().pipe(
          switchMap((res: any) => {
            const newReq = req.clone({
              withCredentials: true
            });
            return next(newReq);
          }),
          catchError((refreshErr) => {
            authService.logout();
            router.navigate(['/auth/login']);
            return throwError(() => refreshErr);
          })
        );
      } else if (error.status === 403) {
        console.warn('Access denied: 403 Forbidden');
      } else if (error.status === 500) {
        console.error('Server error: 500 Internal Server Error', error);
      }
      return throwError(() => error);
    })
  );
};
