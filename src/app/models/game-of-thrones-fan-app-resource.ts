import {Nameable} from "./nameable";
import {SearchType} from "./search-type";

export class GameOfThronesFanAppResource {
  public getPublicName(): string | undefined {
    return "default_name"
  }

  public getFilterableParameters(): SearchType[] {
    return []
  }
}
