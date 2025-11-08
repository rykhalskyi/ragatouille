import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DefaultService } from '../client';

@Component({
  selector: 'app-selected-topic',
  imports: [MatButtonModule],
  templateUrl: './selected-topic.component.html',
  styleUrl: './selected-topic.component.scss'
})

export class SelectedTopicComponent {
 

  protected async ctaClick() {
    var res = await DefaultService.runProofOfConceptPocGet();
    console.log('cta called', res);
  }

}
