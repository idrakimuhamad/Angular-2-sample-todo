import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Hero } from './hero';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {
  private apiUrl = 'api/heroes';
  private headers = new Headers({ 'Content-Type' : 'application/json' });
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  constructor(private http: Http) { }

  getHero(id: number): Promise<Hero> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get(url)
                .toPromise()
                .then(response => response.json().data as Hero)
                .catch(this.handleError);
  }

  getHeroes(): Promise<Hero[]> {
    return this.http.get(this.apiUrl)
                .toPromise()
                .then(response => response.json().data as Hero[])
                .catch(this.handleError);
  }

  create(name: string): Promise<Hero> {
    return this.http
      .post(
        this.apiUrl,
        JSON.stringify({ name: name }),
        { headers: this.headers })
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError);
  }

  update(hero: Hero): Promise<Hero> {
    const url = `${this.apiUrl}/${hero.id}`;

    return this.http.put(url, JSON.stringify(hero), { headers: this.headers })
                .toPromise()
                .then(() => hero)
                .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete(url, { headers: this.headers })
                .toPromise()
                .then(() => null)
                .catch(this.handleError);
  }
}
