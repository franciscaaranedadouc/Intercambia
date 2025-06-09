import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; 
import { MenuController } from '@ionic/angular'; 
import { AlertController } from '@ionic/angular';  
import { FormtearFechaPipe } from '../../pipes/formtear-fecha.pipe';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  nombre:         any='';
  apellido:       any='';
  email:          any='';
  password:       any='';
  selectedOption: any=''; // objetivo
  selectedDate:   any=''; 
   

 constructor(
  private alertController: AlertController, 
  private menu: MenuController,
  private navCtrl: NavController,
  private formtearFechaPipe: FormtearFechaPipe 
 ) { }

  ngOnInit() {
     this.menu.close("mainMenu");
  }

    private async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

   async guardar(): Promise<void> {
    // Nombre y Apellido no vacíos
    if (!this.nombre.trim() || !this.apellido.trim()) {
      await  this.presentAlert('El nombre y el apellido son obligatorios.');
      return;
    }

    // Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.presentAlert('Por favor ingresa un correo electrónico válido.');
      return;
    }

    // Contraseña entre 3 y 4 caracteres
    if (!this.password || this.password.length < 3 || this.password.length > 4) {
      await this.presentAlert('La contraseña debe tener entre 3 y 4 caracteres.');
      return;
    }

    // Objetivo seleccionado
    if (!this.selectedOption) {
      await this.presentAlert('Debes seleccionar un objetivo.');
      return;
    }

    // Fecha de nacimiento y mayor de 18 años
    if (!this.selectedDate) {
      await this.presentAlert('Debes ingresar tu fecha de nacimiento.');
      return;
    }
    const hoy = new Date();
    const nacimiento = new Date(this.selectedDate);
    const edadMs = hoy.getTime() - nacimiento.getTime();
    const edadDate = new Date(edadMs);
    const edad = Math.abs(edadDate.getUTCFullYear() - 1970);
    if (edad < 18) {
      return this.presentAlert('Debes ser mayor de 18 años para registrarte.');
    }

    // Si pasa todas las validaciones
    const fechaFormateada = this.formtearFechaPipe.transform(this.selectedDate);
    console.log({
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password,
      objetivo: this.selectedOption,
      fechaNacimiento: fechaFormateada
    });

    // Muestra mensaje de éxito
    await this.presentAlert('¡Registro exitoso!');
    this.navCtrl.navigateRoot('/home');
    return;
  }
}
