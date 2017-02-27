import { bootstrap } from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment, AppRouterProvider, AuthManager, AuthService } from './app/';
import { HTTP_PROVIDERS } from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';


enableProdMode();

bootstrap(AppComponent,
  [AppRouterProvider,
    disableDeprecatedForms(),
    provideForms(),
    AuthManager,
    AuthService,
    HTTP_PROVIDERS,
    {provide: LocationStrategy, useClass: HashLocationStrategy}]
);
