import { Injectable } from '@angular/core';
import {plainToClassFromExist} from 'class-transformer';
import {Book} from '../../models/book/book';

import * as _ from "lodash"

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  get<ResourceModel>(key: string, resourceType: any): ResourceModel[] {
    let allResourceModelJSON = JSON.parse(localStorage.getItem(key))
    let allResourceModel = this.transformJSONArrayToResourceModel<ResourceModel>(allResourceModelJSON, resourceType)
    return allResourceModel
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  alreadyExists(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  transformJSONArrayToResourceModel<ResourceModel>(json: any, resourceType: any): ResourceModel[] {
    let listOfResourceModels: ResourceModel[] = []

    json.forEach(jsonElement => {
      const jsonElementAsResourceModel = plainToClassFromExist(resourceType, jsonElement)
      // To avoid object reference, we use clone function from lodash
      listOfResourceModels.push(_.clone(jsonElementAsResourceModel))
    })

    return listOfResourceModels
  }
}
