import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-inport-input-row',
  templateUrl: './import-statop-input-row.component.html',
  styleUrls: ['./import-statop-input-row.component.css']
})
export class ImportStatopInputRowComponent implements OnInit {

  dataForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

}
