import { provideRouter, RouterConfig} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
/** import {Menu1Component} from './menu1/menu1.component';*/
import {AuthManager} from './authmanager';
import {DataImportComponent} from './data-import/data-import.Component';
import {QueuingComponent} from './filters/queuing.component';
import {OutreachComponent} from './outreach/outreach.component';
import {OutreachMemberComponent} from './outreach/outreach-member.component';
import {SystemSettingsComponent} from './system-settings/system-settings.component';
import {AppComponent} from './app.component';
import {ReassignAgentComponent} from './reassign-agent/reassign.component';
import{ AgentAssignmentComponent} from './agent-assignment/agent.component';
import{ OutPerformanceComponent} from './outreach-performance/outreach-performance.component';
import{ MeasureCompletionReportsComponent} from './measure-completion-reports/measure-completion-reports.component';
import{ MeasureSummaryReportsComponent} from './measure-summary-reports/measure-summary-reports.component';
import{ JvionDiscrepencyReportComponent} from './jvion-discrepency-report/jvion-discrepency-report.component';
import{ ParkingLotReportsComponent} from './parking-lot-reports/parking-lot-reports.component';
export const appRoutes: RouterConfig = [
    {path: '', redirectTo: 'login'},
    {path: 'login', component:LoginComponent},
    {path: 'dashboard', component:DashboardComponent, canActivate: [AuthManager]},
    {path: 'data-import', component:DataImportComponent,canActivate: [AuthManager]},
    {path: 'system-settings', component:SystemSettingsComponent,canActivate: [AuthManager]},
    {path: 'reassign-agent', component:ReassignAgentComponent,canActivate: [AuthManager]},
    {path: 'filters', component:QueuingComponent,canActivate: [AuthManager]},
    {path: 'agent-assignment', component: AgentAssignmentComponent,canActivate: [AuthManager]},
    {path: 'outreach', component:OutreachComponent, canActivate:[AuthManager]},
    {path: 'outreachmember', component:OutreachMemberComponent,canActivate:[AuthManager]},
    {path : 'outreach-performance' ,component:OutPerformanceComponent,canActivate:[AuthManager]},
    {path : 'measure-completion-reports', component: MeasureCompletionReportsComponent, canActivate:[AuthManager]},
    {path : 'measure-summary-reports', component: MeasureSummaryReportsComponent, canActivate:[AuthManager]},
    {path : 'jvion-discrepency-reports', component: JvionDiscrepencyReportComponent, canActivate:[AuthManager]},
    {path : 'parking-lot-reports', component: ParkingLotReportsComponent, canActivate:[AuthManager]}

];

export const AppRouterProvider = provideRouter(appRoutes);
