import {Nameable} from "../nameable";
import {CharacterInterface} from "./character-interface";
import {GameOfThronesFanAppResource} from "../game-of-thrones-fan-app-resource";
import {SearchType} from "../search-type";

export class Character extends GameOfThronesFanAppResource implements CharacterInterface {
  aliases?: string[];
  allegiances?: string[];
  books?: string[];
  born?: string;
  culture?: string;
  died?: string;
  father?: string;
  gender?: string;
  mother?: string;
  name?: string;
  playedBy?: string[];
  povBooks?: string[];
  spouse?: string;
  titles?: string[];
  tvSeries?: string[];
  url?: string;


  constructor() {
    super();
  }

  getPublicName(): string | undefined {
    if (this.name !== "") {
      return this.name;
    } else {
      return this.aliases[0]
    }
  }

  getFilterableParameters(): SearchType[] {
    return [
      new SearchType("name", "input"),
      new SearchType("gender", "input"),
      new SearchType("culture", "input"),
      new SearchType("born", "input"),
      new SearchType("died", "input"),
      new SearchType("isAlive", "checkbox"),
    ]
  }
}
