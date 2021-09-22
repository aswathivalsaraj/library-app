import { Component, Input, OnInit } from '@angular/core';
import { BooksService } from 'src/app/services/books.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-books',
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent implements OnInit {
  public booksList: any;
  @Input() public search: boolean;
  public apiUrl;
  constructor(private bookService: BooksService, public router: Router) { 
    this.bookService.selectedBookId = 0;
    this.apiUrl = this.bookService.apiUrl;
  }
  ngOnInit(): void {
    this.getAllBooks();    
  }
  public getAllBooks() {
    this.bookService.getAllBooks().subscribe((books)=> {   
      console.log(books);   
      this.booksList = books;
      //this.bookService.allbooks = this.booksList ;
    });
  }
  public editBook(id: number) {   
    this.bookService.selectedBookId = id;
  }
  public deleteBook(id: number) {
    console.log(id);
    if(Number(id) > 0) {
      this.bookService.deleteBook(id).subscribe((allBooks: any) => { 
        this.getAllBooks();  
        this.router.navigate(['home'])
        //this.setFormValues(bookDetails);
      });      
    }
  }
}
