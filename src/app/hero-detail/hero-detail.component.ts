import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Hero, Address, states } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  // moduleId: module.id,
  selector: 'hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})

export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  heroForm: FormGroup;
  states = states;

  constructor(
    private builder: FormBuilder,
    private heroService: HeroService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.heroService.getHero(+params['id']))
      .subscribe(hero => {
        this.hero = hero;

        // when we get hero details, we need to update the Input
        // with the data we get from the server
        this.setDetails();
      });
  }

  ngOnChanges() {
    this.heroForm.reset({
      name: this.hero.name
    });
    this.setAddresses(this.hero.addresses);
  }

  createForm() {
    this.heroForm = this.builder.group({
      name: [ '', Validators.required ],
      hq: this.builder.array([]),
      power: '',
      sidekick: ''
    });
  }

  setDetails() {
    // it will invoke the ngOnChanges,
    // basically setting up the default data based on the
    // data retrieve from the server, if exists
    this.ngOnChanges();
  }

  setAddresses(addresses: Address[]) {
    // if address array is defined, map the addresses
    // into a FormGroup, else set it as an empty array
    const addressGroup = addresses ? addresses.map(address => this.builder.group(address)) : [];

    // create a FormArray out of the form group
    const addressArray = this.builder.array(addressGroup);

    // set the control of the HQ from the heroForm to the addressArray
    this.heroForm.setControl('hq', addressArray);
  }

  get hq(): FormArray {
    return this.heroForm.get('hq') as FormArray;
  }

  addHq() {
    this.hq.push(this.builder.group(new Address()));
  }

  removeHq(index) {
    this.hq.removeAt(index);
  }

  save(): void {
    this.heroService.update(this.hero)
        .then(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
