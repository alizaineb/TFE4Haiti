import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {StationImportDataComponent} from '../_components/stations/import-data/station-import-data.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<StationImportDataComponent> {
  canDeactivate(component: StationImportDataComponent): boolean {

    if (component.hasUnsavedData()) {
      if (confirm('Vous avez des données non envoyées, voulez vous vraiment quitter la page?')) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}

