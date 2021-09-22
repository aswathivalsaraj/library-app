import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  public bookId: number;
  public topics: any;
  public alertMessage: string = "";
  public topicsPath = "../../../assets/data/bookTopics.json";

  booksForm = new FormGroup({
    topics: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    summary: new FormControl('', Validators.required)
  });

  constructor(private bookService: BooksService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.bookService.getJSON(this.topicsPath).subscribe((topics: any) => {        
      this.topics = topics;
    }); 

    this.bookId =  this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')): 0;
    if(this.bookId > 0) {
      this.bookService.getBook(this.bookId).subscribe((bookDetails: any) => { 
        console.log("bookDetails", bookDetails)
        if(bookDetails && bookDetails.length > 0) {
          this.setFormValues(bookDetails[0])
        } else {
          this.alertMessage = "Book does not exists";
        }       
      });      
    }
  }
  public isBookExists() {
    const title = this.booksForm.controls["title"].value ? this.booksForm.controls["title"].value: "";
    let index = this.bookService.allbooks.findIndex((x: any) => x.title === title);
    this.alertMessage = (index >= 0) ? "Book Already Exists": "";    
  }
  private setFormValues(bookDetails: any) {
    this.booksForm.patchValue({     
      topics: bookDetails.topics,
      title: bookDetails.title,
      summary: bookDetails.summary,
    });
  }
 
  public bookUpdate(): void {
    let formData = this.booksForm.getRawValue();
    if(Number(this.bookId) > 0) { // This will update existing book
      console.log(this.bookService.allbooks.length, "this.bookId"+this.bookId);
        this.alertMessage = (this.bookId <= this.bookService.allbooks.length) ? "": "Book does not exists"; 
        formData.id = this.bookId.toString(); 
          this.bookService.updateBookDetails(formData).subscribe((bookDetails: any) => {        
            this.router.navigate(['home'])
        });  
    } else { 
        formData.id = ((this.bookService.allbooks).length + 1).toString(); 
        let bookData: any = { newBook: formData, allBooks: this.bookService.allbooks };
        this.bookService.addNewBook(bookData).subscribe((bookDetails: any) => {     
          this.router.navigate(['home'])
        });

    }
    
  }

}
