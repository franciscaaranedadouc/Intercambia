// src/app/pages/registro/registro.page.ts

import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, AlertController } from '@ionic/angular';
import { FormtearFechaPipe } from '../../pipes/formtear-fecha.pipe';
import { SQLiteService } from '../../data-service/sqlite.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  selectedOption = ''; // objetivo
  selectedDate: any = '';

  constructor(
    private alertController: AlertController,
    private menu: MenuController,
    private navCtrl: NavController,
    private formtearFechaPipe: FormtearFechaPipe,
    private sqliteService: SQLiteService
  ) {}

  ngOnInit() {
    this.menu.close('mainMenu');
    this.sqliteService.inicializarBaseDatos();
  }

  private async presentAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async guardar(): Promise<void> {
    // Validaciones básicas
    if (!this.nombre.trim() || !this.apellido.trim()) {
      return this.presentAlert('El nombre y el apellido son obligatorios.');
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    if (!emailValido) {
      return this.presentAlert('Por favor ingresa un correo electrónico válido.');
    }

    if (!this.password || this.password.length < 3 || this.password.length > 4) {
      return this.presentAlert('La contraseña debe tener entre 3 y 4 caracteres.');
    }

    if (!this.selectedOption) {
      return this.presentAlert('Debes seleccionar un objetivo.');
    }

    if (!this.selectedDate) {
      return this.presentAlert('Debes ingresar tu fecha de nacimiento.');
    }

    // Verificar edad mínima
    const nacimiento = new Date(this.selectedDate);
    const hoy = new Date();
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    if (edad < 18) {
      return this.presentAlert('Debes ser mayor de 18 años para registrarte.');
    }

    // Verificar si el correo ya está en la base de datos
    const yaExiste = await this.sqliteService.existeCorreo(this.email.trim());
    if (yaExiste) {
      return this.presentAlert('Este correo ya está registrado.');
    }

    const fechaFormateada = this.formtearFechaPipe.transform(this.selectedDate);

    const ok = await this.sqliteService.guardarUsuario({
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      email: this.email.trim(),
      password: this.password,
      objetivo: this.selectedOption,
      fechaNacimiento: fechaFormateada
    });

    if (ok) {
      await this.presentAlert('¡Registro exitoso!');
      this.navCtrl.navigateRoot('/login');
    } else {
      await this.presentAlert('Error: ocurrió un fallo interno al guardar.');
    }
  }
}
