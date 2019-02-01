import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TableComponent} from './table/table.component';
import {NotFoundComponent} from './not-found/not-found.component';

const routes: Routes = [
    {path: '', component: TableComponent},
    {path: 'favorite', component: TableComponent},
    {path: 'deleted', component: TableComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: '**', redirectTo: '/not-found'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
