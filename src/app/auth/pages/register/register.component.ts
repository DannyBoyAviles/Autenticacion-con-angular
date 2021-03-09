import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent{

  miFormulario: FormGroup = this.fb.group({
    name:    ['test 1', [Validators.required]],
    email:    ['test1@test.com', [Validators.required, Validators.email]],
    password:    ['123456', [Validators.required, Validators.minLength(6)]]
  })

  constructor(private fb: FormBuilder,
              private router:Router) { }

  registrar(){
    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);
    this.router.navigateByUrl('/dashboard')
  }

}
