import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as config from './../../server/config/config.json';
@Injectable({
  providedIn: 'root'
})
export class BooksService {
  public configData: any;
  public apiUrl: string;
  public selectedBookId: number;
  public allbooks: any = [];
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(private http: HttpClient) { 
    this.configData = JSON.parse(JSON.stringify(config));
    this.apiUrl     = this.configData ? (this.configData.hostname +":"+this.configData.port): "";
  }
  public getAllBooks() {
    return this.http.get(this.apiUrl+"/books"); 
  }
  public getBook(id: number){
    return this.http.get(this.apiUrl + "/books/" + id); 
  }
  public searchBook(title: string) {
    return this.http.post(this.apiUrl+"/books/search/", { title: title}, this.httpOptions); 
  }
  public getJSON(jsonFilePath: string) {   
    //"./../../assets/data/books-data.json" 
    return this.http.get(jsonFilePath)
  }
  public updateBookDetails(bookData: any) {
    return this.http.put(this.apiUrl+"/books/"+ bookData.id, bookData, this.httpOptions); 
  }
  public addNewBook(bookData: any){
    return this.http.post(this.apiUrl+"/books", bookData, this.httpOptions); 
  }
  public deleteBook(bookid: number) {
   // const bookData: any = { id: bookid, allBooks: JSON.stringify(this.allbooks) }
    return this.http.delete(this.apiUrl+"/books/" + bookid); 
  }
}
