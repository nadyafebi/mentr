import { NgModule } from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatProgressSpinnerModule
} from '@angular/material';

const modules = [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatProgressSpinnerModule
];

@NgModule({
    imports: modules,
    exports: modules
  })
  export class MaterialModule { }
