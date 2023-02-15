import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountService } from "@app/_services/account.service";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    constructor (private accountService: AccountService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.accountService.userValue;
        const loggenIn = user && user.token;
        const apiUrl = request.url.startsWith(environment.apiUrl);

        if(loggenIn && apiUrl){
            request = request.clone({
                setHeaders:{
                    Authorization: `Bearer ${user.token}`
                }
            });
        }

        return next.handle(request);
    }
}