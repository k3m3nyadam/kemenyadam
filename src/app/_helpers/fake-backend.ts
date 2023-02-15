import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize } from 'rxjs/operators';

const userKey = 'users';
let users: any[] = JSON.parse(localStorage.getItem(userKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const {url, method, headers, body} = request;
        return routeHandle();

        function routeHandle(){
            switch(true){
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserId();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default: 
                    return next.handle(request);
            }
        }

        function authenticate(){
            const {username, password} = body;
            const user = users.find(x => x.username === username && x.password === password);

            if(!user) return error('Your username or password is incorrect!');
            return ok({
                ...details(user),
                token: 'fake-jwt-token'
            });
        }

        function register(){
            const user = body;

            if(users.find(x => x.username === user.username)){
                return error('Username"' + user.username + '" is already taken!');
            }

            user.id = users.length ? Math.max(... users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(userKey, JSON.stringify(users));
            return ok();
        }

        function getUsers(){
            if(!loggenIn()) return unauthorized();
            return ok(users.map(x => details(x)));
        }

        function getUserId(){
            if(!loggenIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(details(user));
        }

        function updateUser(){
            if(!loggenIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            if(!params.password){delete params.password;}

            Object.assign(user, params);
            localStorage.setItem(userKey, JSON.stringify(users));
            return ok();
        }

        function deleteUser(){
            if(!loggenIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem(userKey, JSON.stringify(users));
            return ok();
        }

        function loggenIn(){
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function unauthorized(){
            return throwError(() => ({status: 401, error: {messege: 'unauthorized'}}))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function ok(body?: any){
            return of(new HttpResponse({status: 200, body}))
                .pipe(delay(500));
        }

        function details(user: any){
            const {id, username, firstName, lastName} = user;
            return {id, username, firstName, lastName};
        }

        function error(message: string){
            return throwError(() => ({error: {message}}))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function idFromUrl(){
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length -1]);
        }
    }
}

export const FakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
}
