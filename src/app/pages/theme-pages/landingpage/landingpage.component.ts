import { Component} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, RouterLink],
  templateUrl: './landingpage.component.html',
})
export class AppLandingpageComponent {
  constructor() {}

}