import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-bank-card',
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.css']
})
export class BankCardComponent implements OnInit {
  bankCardForm = this.formBuilder.group({
    cardNumber: '',
    monthOfExpiring: '',
    yearOfExpiring: '',
    cvv: ''
  });
  constructor(
    private formBuilder: FormBuilder,
  ) { }
  ngOnInit(): void {
  }

  onSubmit(): void {
    alert("Card added" + this.bankCardForm.value.cvv);
    this.bankCardForm.reset();
  }
}
