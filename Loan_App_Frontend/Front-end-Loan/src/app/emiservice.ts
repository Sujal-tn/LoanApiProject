import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Emiservice {
 
 constructor (private http:HttpClient)
 {

 }

url="https://localhost:44357/api/EmiPayment/MakeEmiPayment";

 emipayment(data:any)
 {
  return this.http.post<any>(this.url,data.value);
 }

 url2="https://localhost:44357/api/EmiPayment/CreateOrder";
createOrder(eid: number, amo: number) {
  return this.http.post(this.url2,{emiScheduleId: eid,amount: amo},{responseType: 'text'});
}

url3="https://localhost:44357/api/EmiPayment/GetEmiD"

getemidetails(eid:any)
{
 return this.http.get<any>(`${this.url3}/${eid}`);
}

url4="https://localhost:44357/api/EmiPayment/VerifyEmiPayment";
verifypay(data:any)
{
   return this.http.post<any>(this.url4,data);
}

}

