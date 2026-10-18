import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ForeclosureService {
 constructor(private http:HttpClient){

 }
 
 loanurl="https://localhost:44365/api/loan-accounts/my-accounts";
 getloanaccounts()
 {
   return this.http.get<any>(this.loanurl);
 }
 
 url="https://localhost:44365/api/ForeClosure/CreateForeClousre"
 createforeclosure(data:any)
 {
   return this.http.post<any>(this.url,data)
 }

 url1="https://localhost:44365/api/ForeClosure/FCGetById";
 myrequest()
 {
  return this.http.get<any>(this.url1);
 }
}
