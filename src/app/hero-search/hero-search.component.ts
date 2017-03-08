import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Map to observable, complete previous inner observable, emit values.
// switchMap()


// observable class extensions
import 'rxjs/add/observable/of';

// observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { SearchService } from '../search.service';
import { Hero } from '../hero';

@Component({
  // moduleId: module.id,
  selector: 'hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [SearchService]
})

export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;

  private searchTerms = new Subject<string>();

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  // push the term into observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    // wait 300ms after keystroke
    // ignore if next search term is same as previous
    // switch to new Observable each time the term changes
    this.heroes = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term ? // return http search Observable or the empty Observable of heroes if term is undefined
        this.searchService.search(term) : Observable.of<Hero[]>([]))
      .catch(error => {
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }
}
