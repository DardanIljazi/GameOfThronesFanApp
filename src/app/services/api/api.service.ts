import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CharacterInterface} from '../../models/character/character-interface';
import {Character} from '../../models/character/character';
import {BookInterface} from '../../models/book/book-interface';
import {HouseInterface} from '../../models/house/house-interface';
import {House} from '../../models/house/house';
import {HttpClient} from '@angular/common/http';
import {plainToClass, plainToClassFromExist} from 'class-transformer';
import {Book} from '../../models/book/book';
import * as _ from "lodash"
import {LocalstorageService} from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = "https://anapioficeandfire.com/api"

  constructor(private http: HttpClient, private localstorageService: LocalstorageService) {

  }

  getAllCharacters(saveInLocalStorage: boolean = false): Promise<Character[]> {
    return this.getAllResourceElementsFromLocalStorageOrBackend<CharacterInterface, Character>(
      "characters",
      new Character(),
      saveInLocalStorage
    )
  }

  getAllCharactersAndSaveThemInLocalStorageIfNotAlreadyTheCase(): Promise<Character[]> {
    if (this.localstorageService.alreadyExists("characters")) {
      return Promise.reject("No need to take characters, they are already in local storage")
    }
    return this.getAllCharacters(true)
  }

  getCharactersAtPage(page = 1): Promise<Character[]> {
    return this.getResourceAtPage<CharacterInterface, Character>('characters', page, new Character())
  }

  getAllBooks(saveInLocalStorage: boolean = false): Promise<Book[]> {
    return this.getAllResourceElementsFromLocalStorageOrBackend<BookInterface, Book>(
      "books",
      new Book(),
      saveInLocalStorage
    )
  }

  getAllBooksAndSaveThemInLocalStorageIfNotAlreadyTheCase(): Promise<Book[]> {
    if (this.localstorageService.alreadyExists("books")) {
      return Promise.reject("No need to take books, they are already in local storage")
    }
    return this.getAllBooks(true)
  }

  getBooksAtPage(page = 1): Promise<Book[]> {
    return this.getResourceAtPage<BookInterface, Book>('books', page, new Book())
  }

  getBook(id): Promise<Book> {
    return this.getResource<BookInterface, Book>('books', id, new Book());
  }

  getHousesAtPage(page= 1): Promise<House[]> {
    return this.getResourceAtPage<HouseInterface, House>('houses', page, new House())
  }

  getAllHouses(saveInLocalStorage: boolean = false): Promise<House[]> {
    return this.getAllResourceElementsFromLocalStorageOrBackend<HouseInterface, House>(
      "houses",
      new House(),
      saveInLocalStorage
    )
  }

  getAllHousesAndSaveThemInLocalStorageIfNotAlreadyTheCase(): Promise<House[]> {
    if (this.localstorageService.alreadyExists("houses")) {
      return Promise.reject("No need to take houses, they are already in local storage")
    }
    return this.getAllHouses(true)
  }


  search(resourceName: string, name: string, searchText: string): any {
    switch (resourceName) {
      case 'houses':
        // return this.getResourceAtPage<HouseInterface, House>('houses', 1, new House())
        break;
      case 'characters':
        break;
      case 'books':
        break;
    }
  }

  /**
   * Generic method to get a resource from backend
   * INFO: plainToClassFromExist maps a json object to a class but only accept instances and not generic types as first parameter
   *       that's why resourceType has been added as parameter to the function (it's a bit ugly)
   */
  getResourceAtPage<ResourceInterface, ResourceModel>(resourceName: string,
                                                      page = 1,
                                                      resourceType: ResourceModel): Promise<ResourceModel[]>
  {
    if (this.localstorageService.alreadyExists(resourceName)) {
      console.log('Already exists, going to return data from local storage at page: ', page)
      return Promise.resolve(
        this.localstorageService.get<ResourceModel>(resourceName, resourceType).slice((page - 1) * 10, page * 10)
      )
    } else {
      return new Promise((resolve, reject) => {
        this.http.get<[ResourceInterface]>(`${this.apiUrl}/${resourceName}?page=${page}`)
          .subscribe(resourceInterfacesObject => {
              let resourceModels: ResourceModel[] = []

              resourceInterfacesObject.forEach(resourceInterfaceObject => {
                const resourceModel = plainToClassFromExist(resourceType, resourceInterfaceObject)
                resourceModels.push(
                  // To avoid object reference, we use lodash clone method
                  _.clone(resourceModel)
                )
              })
              resolve(resourceModels)
            },
            error => {
              reject(`Error: ${error}`)
            })
      })
    }
  }

  /**
   * Generic method to get a resource from backend
   * INFO: plainToClassFromExist maps a json object to a class but only accept instances and not generic types as first parameter
   *       that's why resourceType has been added as parameter to the function (it's a bit ugly)
   */
  getResource<ResourceInterface, ResourceModel>(resourceName: string, id: number, resourceType: any): Promise<ResourceModel> {
    return new Promise<ResourceModel>((resolve, reject) => {
      this.http.get<ResourceInterface>(`${this.apiUrl}/${resourceName}/${id}`).subscribe(resourceInterfaceObject => {
          resolve(plainToClassFromExist(resourceType, resourceInterfaceObject))
        },
        error => {
          reject(`Error while trying to get element in getResource: ${error}`)
        })
    })
  }

  /**
   * Generic function to get all resource elements from backend
   */
  async getAllResourceElementsFromBackend<ResourceInterface, ResourceModel>(resourceName: string, resourceType: any): Promise<ResourceModel[]> {
    return new Promise((async (resolve, reject) => {
      const pages = await this.getNumberOfPagesPerResource(resourceName)
      let allResourceElements = []
      for (let page = 1; page <= pages; page++) {
        const resourceElementsForPage = await this.getResourceAtPage<ResourceInterface, ResourceModel>(resourceName, page, resourceType)
        allResourceElements.push(...resourceElementsForPage)
      }

      if (allResourceElements.length === 0) {
        reject("It seems data is not returned properly from backend in getAllResourceElements")
      }

      resolve(allResourceElements)
    }))
  }

  async getAllResourceElementsFromLocalStorageOrBackend<ResourceInterface, ResourceModel>(
    resourceName: string,
    resourceType: any,
    saveInLocalStorage: boolean
  ): Promise<ResourceModel[]> {

    if (this.localstorageService.alreadyExists(resourceName)) {
      return this.getResourceElementsIfAlreadyInLocalStorage<ResourceModel>(resourceName, resourceType)
    }

    let allResources: ResourceModel[] = await this.getAllResourceElementsFromBackend<ResourceInterface, ResourceModel>(resourceName, resourceType)

    if (saveInLocalStorage) {
      this.localstorageService.set(resourceName, allResources)
    }

    return Promise.resolve(allResources)
  }

  /**
   * Returns the number of pages we have to take to get all data (data is paginated)
   * INFO: This information is found in response header ("link")
   */
  getNumberOfPagesPerResource(resourceName: string): Promise<number> {
    const regExp = new RegExp(/<https:\/\/anapioficeandfire.com\/api\/.*?page=(\d+)&pageSize=\d*>; rel="last"/, 'g')

    return new Promise<number>((resolve, reject) => {
      this.http.get(`${this.apiUrl}/${resourceName}`, {
        observe: "response",
      }).subscribe(response => {
        const link = response.headers.get('link')
        if (link == null) {
          reject("Link was not found in header, this should not happen")
        }

        const regexRes = regExp.exec(link)

        if (regexRes[1] == null) {
          reject("Did not find number of pages")
        }

        resolve(parseInt(regexRes[1], 10))
      })
    })
  }

  getResourceElementsIfAlreadyInLocalStorage<ResourceModel>(resourceName: string, resourceType: any): Promise<ResourceModel[]> {
    return new Promise((resolve => {
      console.log(`${resourceName} already exist, going to take what we have in localstorage`)
      let allResourceModels = this.localstorageService.get<ResourceModel>(resourceName, resourceType)
      resolve(allResourceModels)
    }))
  }


}
