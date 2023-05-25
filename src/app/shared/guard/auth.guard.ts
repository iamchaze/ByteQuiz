import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem('userid') || sessionStorage.getItem('userid')){
    return true
  } else {
    return false
  }
};
