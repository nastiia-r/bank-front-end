import { Component, ViewEncapsulation } from '@angular/core';
import { ClarityModule } from '@clr/angular'; 


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ClarityModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {

}
