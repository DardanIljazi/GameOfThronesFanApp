import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api/api.service';
import {House} from '../../models/house/house';
import {Book} from '../../models/book/book';
import {Character} from '../../models/character/character';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  resourceGroupForm: FormGroup;
  resourcesToShowForActualPagination: any;
  actualCollectionSize = 0
  actualShownResourceElements = "books"

  actualPage = 1
  pageSize = 10

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) {
    this.apiService.getAllHousesAndSaveThemInLocalStorageIfNotAlreadyTheCase()
      .then(() => {
        console.log('All houses saved in local storage')
      })
      .catch((message) => {
        console.log(message)
      })

    this.apiService.getAllBooksAndSaveThemInLocalStorageIfNotAlreadyTheCase()
      .then(() => {
        console.log('All books saved in local storage')
      })
      .catch((message) => {
        console.log(message)
      })

    this.apiService.getAllCharactersAndSaveThemInLocalStorageIfNotAlreadyTheCase()
      .then(() => {
        console.log('All characters saved in local storage')
      })
      .catch((message) => {
        console.log(message)
      })
  }

  ngOnInit(): void {
    this.resourceGroupForm = this.formBuilder.group({
      resource: 'books'
    });

    this.getAndShowResourceElements('books')

    this.resourceGroupForm.valueChanges.subscribe(resourceValueChanged => {
      this.actualPage = 1
      this.getAndShowResourceElements(resourceValueChanged.resource)
    })
  }

  showResource(resource: string, id: number): void {
    switch (resource) {
      case 'houses':
        this.router.navigate(['house', id]).then()
        break;
      case 'books':
        this.router.navigate(['book', id]).then()
        break;
      case 'characters':
        this.router.navigate(['character', id]).then()
        break;
    }
  }

  getAndShowResourceElements(resource: string) {
    this.actualShownResourceElements = resource

    switch (resource) {
      case 'houses':
        this.apiService.getResourceAtPage("houses", this.actualPage, new House()).then(data => {
          this.resourcesToShowForActualPagination = data
        })
        break;
      case 'books':
        this.apiService.getResourceAtPage("books", this.actualPage, new Book()).then(data => {
          this.resourcesToShowForActualPagination = data
        })
        break;
      case 'characters':
        this.apiService.getResourceAtPage("characters", this.actualPage, new Character()).then(data => {
          this.resourcesToShowForActualPagination = data
        })
        break;
    }

    this.apiService.getNumberOfPagesPerResource(resource).then(numberOfPage => {
      this.actualCollectionSize = numberOfPage * this.pageSize
    })
  }

  getNameBasedOnResource(resource: any): string {
    if (resource.name !== "") {
      return resource.name
    } else {
      return resource.aliases[0]
    }
  }

  onPageChanges(): void {
    this.getAndShowResourceElements(this.actualShownResourceElements)
  }

  getResourceIdFromUrl(url): number {
    const regExp = /https:\/\/anapioficeandfire.com\/api\/.*\/(\d+)/g

    const result = regExp.exec(url)
    if (result[1] === null) {
      console.error("Warning, result does not have a value")
      return 0
    }

    return parseInt(result[1], 10)
  }
}
