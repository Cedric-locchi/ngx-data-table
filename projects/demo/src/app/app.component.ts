import { Component, signal } from '@angular/core';
import { DataTableComponent } from '../../../ng-data-table/src/lib/data-table/data-table.component';
import { colDef } from '../../../ng-data-table/src/lib/core/types/coldef';
import gamesData from './ressources/data.json';
import { DataTableHeaderComponent, DataTableFooterComponent, DataTableInputSearchComponent } from "../../../ng-data-table/src/public-api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataTableComponent, DataTableHeaderComponent, DataTableFooterComponent, DataTableInputSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Démo NgxDataTable';

  // Données des jeux de société
  games = signal(gamesData);

  // Définition des colonnes
  colDef = signal<colDef[]>([
    {
      headerName: 'Titre',
      field: 'title',
      isVisible: true,
      isBold: true,
      isSortable: true,
      isClickable: true
    },
    {
      headerName: 'Description',
      field: 'description',
      isVisible: true,
      isEllipsis: true
    },
    {
      headerName: 'Date de création',
      field: 'creationDate',
      isVisible: true,
      isDate: true,
      isSortable: true
    },
    {
      headerName: 'Tags',
      field: 'tags',
      isVisible: true
    },
    {
      headerName: 'Note',
      field: 'rating',
      isVisible: true,
      isSortable: true
    }
  ]);

  // Gestion du clic sur une ligne
  onRowClick(event: any) {
    console.log('Ligne cliquée:', event);
  }

  find(value: string) {
    console.log(value);
  }
}
