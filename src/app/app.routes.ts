import { Routes } from '@angular/router';
import { PrinterComponent } from './printer/printer.component';

export const routes: Routes = [
  { path: '', redirectTo: '/printer', pathMatch: 'full' },
  { path: 'printer', component: PrinterComponent },
];
