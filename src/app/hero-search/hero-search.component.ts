import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../models/hero';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchName = new Subject<string>();

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.heroes$ = this.searchName.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((heroName: string) => this.heroService.searchHeroes(heroName))
    );
  }

  searchHero(heroName: string): void {
    this.searchName.next(heroName);
  }
}
