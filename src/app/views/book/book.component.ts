import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';
import {Book} from '../../models/book/book';
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  id: number
  book: Book

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService) {
    this.book = null
  }

  ngOnInit(): void {
    console.log('ngOnInit')
    this.id = this.activatedRoute.snapshot.params.id
    this.apiService.getBook(this.id).then(book => {
      console.log(book)
      this.book = book
    })
  }

}
