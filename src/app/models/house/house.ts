import {Nameable} from "../nameable";
import {HouseInterface} from "./house-interface";
import {GameOfThronesFanAppResource} from "../game-of-thrones-fan-app-resource";
import {SearchType} from "../search-type";

export class House extends GameOfThronesFanAppResource implements HouseInterface {
  ancestralWeapons?: string[];
  cadetBranches?: string[];
  coatOfArms?: string;
  currentLord?: string;
  diedOut?: string;
  founded?: string;
  founder?: string;
  heir?: string;
  name?: string;
  overlord?: string;
  region?: string;
  seats?: string[];
  swornMembers?: string[];
  titles?: string[];
  url?: string;
  words?: string;


  constructor() {
    super();
  }

  getPublicName(): string | undefined {
    return this.name;
  }

  getFilterableParameters(): SearchType[] {
    return [
      new SearchType("name", "input"),
      new SearchType("region", "input"),
      new SearchType("words", "input"),
      new SearchType("hasWord", "checkbox"),
      new SearchType("hasTitles", "checkbox"),
      new SearchType("hasSeats", "checkbox"),
      new SearchType("hasDiedOut", "checkbox"),
      new SearchType("hasAncestralWeapons", "checkbox"),
    ]
  }
}
