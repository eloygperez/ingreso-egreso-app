import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
    private firestore: AngularFirestore) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
      if (fuser) {
        console.log(fuser.uid);
        console.log(fuser.email);
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.firestore.doc(`usuarios/${user.uid}`)
          .set({ ...newUser });
      });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }
}
