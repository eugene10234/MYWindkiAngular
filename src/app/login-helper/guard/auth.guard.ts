import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  const jwt = localStorage.getItem('jwt');
  if (jwt) {
    const payload = JSON.parse(window.atob(jwt.split('.')[1]));
    const exp = new Date(Number(payload.exp) * 1000);
    if (new Date() > exp) {
      alert('JWT已過期，請重新登入');
      router.navigate(['/mainpage']);
      loginService.JWTLogout();
      return false;
    }
  } else {
    alert('尚未登入');
    router.navigate(['/mainpage']);
    loginService.toggleLoginForm(true);
    return false;
  }

  return true;
};
