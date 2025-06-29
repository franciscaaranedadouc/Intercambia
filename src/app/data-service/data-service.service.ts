//src/app/data-service/data-service.service.ts

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  name: string;
  email: string;
  password: string;
  // …otros campos si los tienes
}

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  public dbInstance!: SQLiteObject;

  constructor(private sqlite: SQLite) {
    this.initializeDatabase();
  }

  /** 1. Abre/crea la BD y la tabla users */
  async initializeDatabase() {
    this.dbInstance = await this.sqlite.create({
      name: 'intercambia.db',
      location: 'default',
    });
    await this.createTables();
  }

  async createTables() {
    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS users(
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         nombre TEXT,
         apellido TEXT,
         email TEXT UNIQUE,
         password TEXT,
         nivel_educacion TEXT,
         fecha_nacimiento TEXT
       )`,
      []
    );
  }

  /** 2. Inserta un usuario */
  async registerUser(
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    nivelEducacion: string,
    fechaNacimiento: string
  ): Promise<boolean> {
    try {
      await this.dbInstance.executeSql(
        `INSERT INTO users
           (nombre, apellido, email, password, nivel_educacion, fecha_nacimiento)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, email, password, nivelEducacion, fechaNacimiento]
      );
      return true;
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      return false;
    }
  }

  /** 3. Comprueba credenciales - Iniciar sesion */
  async loginUser(email: string, password: string): Promise<boolean> {
    const result = await this.dbInstance.executeSql(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      [email, password]
    );
    return result.rows.length > 0;
  }

  /** 4. Opción: stream para saber si hay sesión */
  isLoggedIn(): Observable<boolean> {
    // Chequea un flag en otra tabla o token en memoria
    return from(Promise.resolve(false)).pipe(map(() => false));
  }
}
