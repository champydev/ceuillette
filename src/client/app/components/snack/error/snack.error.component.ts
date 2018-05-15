import { Component ,Input,Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
@Component({
  selector: 'app-snack-error',
  templateUrl: './snack.error.component.html',
  styleUrls: ['./snack.error.component.css']
})
export class SnackErrorComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
