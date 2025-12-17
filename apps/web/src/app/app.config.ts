import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BASE_API_URL } from '@shared/models';
import { credentialsInterceptor } from '@shared/auth';
import { storeConfig } from '@shared/state-management';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    { provide: BASE_API_URL, useValue: 'http://localhost:4000/' },
    ...storeConfig.providers,
  ],
};
