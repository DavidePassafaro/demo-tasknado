import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BASE_API_URL } from '@shared/models';

/**
 * An HTTP interceptor that adds credentials to requests targeting the API server.
 * It checks if the request URL starts with the base API URL and, if so,
 * clones the request to include credentials (like cookies).
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(BASE_API_URL);

  // Check if the request URL starts with the API URL
  if (req.url.indexOf(`${apiUrl}api`) === 0) {
    // Clone the request and add credentials
    req = req.clone({ withCredentials: true });
  }

  return next(req);
};
