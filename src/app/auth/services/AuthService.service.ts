import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Credentials, PasswordReset, RegisterUser, SendCode, User, UserData } from '../interfaces/Credentials';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrlLogin = environment.apiUrl + 'auth/login';
  private apiUrlRegister = environment.apiUrl + 'auth/register';
  private apiUrlRoles = environment.apiUrl + 'auth/roles';
  private apiUrlSendCode = environment.apiUrl + 'change-password/send-otp';
  private apiUrlPasswordReset = environment.apiUrl + 'change-password/reset-otp';
  //private currentUser: UserData | null = null;
  private userDataKey = 'userData';

  constructor(private http: HttpClient, private router: Router) {
  }

  login(credentials: Credentials): Observable<any> {
    return this.http.post<any>(this.apiUrlLogin, credentials).pipe(
      tap((response) => {
        this.setUserData(response.data);
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error.message || 'Ocurrio un error intentalo mas tarde')
        );
      })
    );
  }

  register(body: RegisterUser): Observable<any> {
    body.username = body.email;
    body.role = Number(body.role);
    body.birth_date = this.formatDate(new Date());
    return this.http.post<any>(this.apiUrlRegister, body).pipe(
      tap((response) => {
       return response;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error.message || 'Ocurrio un error intentalo mas tarde')
        );
      })
    );
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(this.apiUrlRoles).pipe(
      tap((response) => {
       return response;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error.message || 'Ocurrio un error intentalo mas tarde')
        );
      })
    );
  }

  passwordSendCode(body: SendCode): Observable<any> {
    return this.http.post<any>(this.apiUrlSendCode, body).pipe(
      tap((response) => {
       return response;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error.message || 'Ocurrio un error intentalo mas tarde')
        );
      })
    );
  }

  passwordReset(body: PasswordReset): Observable<any> {
    return this.http.post<any>(this.apiUrlPasswordReset, body).pipe(
      tap((response) => {
       return response;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error.message || 'Ocurrio un error intentalo mas tarde')
        );
      })
    );
  }

  private setUserData(userData: UserData): void {
    localStorage.setItem(this.userDataKey, JSON.stringify(userData));
  }

   getUserData(): UserData | null {
    if(typeof window !== 'undefined'){
    const userDataString = localStorage.getItem(this.userDataKey);
    return userDataString ? (JSON.parse(userDataString) as UserData) : null
    }else{
      return null;
    }
  }

  isAuthenticated(): boolean {
    const userData = this.getUserData();
    if(!userData){
      return false;
    }else{
      return this.isValidToken(userData);
    }
  }

  isValidToken(userData: UserData): boolean {
    try {
      const decodedToken: any = jwtDecode(userData.access_token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.userDataKey);
    localStorage.removeItem('timer');
    this.router.navigate(['/login']);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
}
