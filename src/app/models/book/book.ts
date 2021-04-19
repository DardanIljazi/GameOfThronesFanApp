import {Nameable} from "../nameable";
import {BookInterface} from "./book-interface";
import {GameOfThronesFanAppResource} from "../game-of-thrones-fan-app-resource";
import {SearchType} from "../search-type";

export class Book extends GameOfThronesFanAppResource implements BookInterface {
  authors?: [string]
  characters?: [string]
  country?: string
  isbn?: string
  mediaType?: string
  name?: string
  numberOfPages?: number
  pobCharacters?: [string]
  publisher?: string
  release?: string
  url?: string

  constructor() {
    super();
  }

  getPublicName(): string | undefined {
    return this.name;
  }


  getFilterableParameters(): SearchType[] {
    return [
      new SearchType("name", "input"),
      new SearchType("fromReleaseDate", "input"),
      new SearchType("toReleaseDate", "input"),
    ]
  }
}
