import { Component, OnInit } from '@angular/core';
import {JerseysService} from "../../../@core/services/jerseys.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'ngx-jersey',
  templateUrl: './jersey.component.html',
  styleUrls: ['./jersey.component.scss']
})
export class JerseyComponent implements OnInit {

  public jerseyArray = [];
  public form: FormGroup;

  constructor(
    private jerseyService: JerseysService
  ) {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required]),
    });
  }

  get name() { return this.form.get('name'); }
  get value() { return this.form.get('value'); }

  ngOnInit() {
    this.jerseyService.getAllJersey().subscribe(response => {
      this.jerseyArray = response["response"];
      console.log(response);
    })
  }

  addJersey(input) {
    this.jerseyService.addJersey(input).subscribe(response => {
      console.log(response);
    })
  }

}
