import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  
  private _months: {name: string, value: number}[] = []
  private _gWP_RGs: {name: string, id: number}[] = []
  private _fuel: {name: string, id: number}[] = []
  private _anaerobicDeepLagoons: {name: string, id: number}[] = []
  private _fuelType1: {name: string, id: number}[] = []
  private _fuelTypeBoilers: {name: string, id: number}[] = []
  private _purposes: {name: string, id: number}[] = []
  private _units: {name: string, id: number}[] = []
  private _electricity_units: {name: string, id: number}[] = []
  private _sources: {name: string, id: number}[] = []
  private _countries: {name: string, id: number, code:string}[] = []
  private _industries: {name: string, id: number}[] = []
  private _tieres: {name: string, id: number}[] = []
  private _currencies: {name: string, id: number}[] = []
  private _assessment_type: {name: string, id: number}[] = []
  private _impact_types: {name: string, id: number}[] = []
  private _impact_categories: {name: string, id: number}[] = []
  private _impact_characteristics: {name: string, id: number}[] = []





  constructor() {
    this.months = [
      { value: 0, name: "January" },
      { value: 1, name: "February" },
      { value: 2, name: "March" },
      { value: 3, name: "April " },
      { value: 4, name: "May" },
      { value: 5, name: "June" },
      { value: 6, name: "July" },
      { value: 7, name: "August" },
      { value: 8, name: "September" },
      { value: 9, name: "October" },
      { value: 10, name: "November" },
      { value: 11, name: "December" },
    ],

    this.gWP_RGs = [
    { id: 1, name: "R22" },
    { id: 2 , name: "R407C" },
    { id: 3, name: "R410A" },
    { id: 4, name: "R134A" }]

    this.fuel =  [
     { id: 1, name: "LAD" },
     { id: 2, name: "LSD" },
     { id: 3, name: "LP92" },
     { id: 4, name: "LP95" }]

     this.anaerobicDeepLagoons =  [
      { id: 1, name: "Sea, River and lake discharge" },
      { id: 2, name: "Aerobic treatment plant with well managed" },
      { id: 3, name: "Aerobic treatment plant without well managed" },
      { id: 4, name: "Anaerobic digester for sludge" },
      { id: 5, name: "Anaerobic Reactor" },
      { id: 6, name: "Anaerobic shallow lagoon" },
      { id: 7, name: "Anaerobic deep lagoon" },]

    this.fuelType1 =  [
    { id: 1, name: "Petrol" },
    { id: 2, name: "Diesel" }]

    this.fuelTypeBoilers =  [
      { id: 1, name: "Residual Fuel Oil" },]

    this.purposes =  [
    { id: 1, name: "purpose 1" },
    { id: 2, name: "purpose 2" }]
    
    
    
    this.units = [
    { id: 1, name: "l" }, 
    { id: 2, name: "m3" },
    { id: 2, name: "LKR" }]

    this.electricity_units = [
      { id: 1, name: "kWh" }
    ]

     
    this.sources = [
      { id: 1, name: "Stationary" }, 
      { id: 2, name: "Mobile" },
      
    ]

    this.industries = [
      { id: 1, name: "Energy" }, 
      { id: 2, name: "Manufacturing and Construction" },
      { id: 2, name: "Commercial/Institutional" },
      { id: 2, name: "Residential and Agriculture/Foresty/Fishing" },
    ]

    this.tieres = [
      { id: 1, name: "Tier1" }, 
      { id: 2, name: "Tier2" },
      { id: 2, name: "Tier3" },
    ]
    this.countries = [
      { id: 1, name: "SriLanka" ,code:"LK"}, 
      { id: 2, name: "India" ,code:"IND"}, 
  
    ]

    this.currencies = [
      { id: 1, name: "USD($)" },
      { id: 2, name: "EUR(€)" },
      { id: 3, name: "LKR(Rs)" },
      { id: 4, name: "INR(₹)" }]

    this.assessment_type = [
      { id: 1, name: "Ex-ante" },
      { id: 2, name: "Ex-post" }
    ]
    this.impact_types = [
      { id: 1, name: "Ex-ante" },
      { id: 2, name: "Ex-post" }
    ]
    this.impact_categories = [
      { id: 1, name: "Ex-ante" },
      { id: 2, name: "Ex-post" }
    ]
    this.impact_characteristics = [
      { id: 1, name: "Ex-ante" },
      { id: 2, name: "Ex-post" }
    ]
  }





  set months(value: { name: string; value: number }[]) {
    this._months = value;
  }

  get months(): { name: string; value: number }[] {
    return this._months;
  }

  set gWP_RGs(value: { name: string; id: number }[]) {
    this._gWP_RGs = value;
  }

  get gWP_RGs(): { name: string; id: number }[] {
    return this._gWP_RGs;
  }

  set fuel(value: { name: string; id: number }[]) {
    this._fuel = value;
  }

  get fuel(): { name: string; id: number }[] {
    return this._fuel;
  }

  set fuelType1(value: { name: string; id: number }[]) {
    this._fuelType1 = value;
  }

  get fuelType1(): { name: string; id: number }[] {
    return this._fuelType1;
  }

  set fuelTypeBoilers(value: { name: string; id: number }[]) {
    this._fuelTypeBoilers = value;
  }

  get fuelTypeBoilers(): { name: string; id: number }[] {
    return this._fuelTypeBoilers;
  }

  set units(value: { name: string; id: number }[]) {
    this._units = value;
  }

  get units(): { name: string; id: number }[] {
    return this._units;
  }

  set purposes(value: { name: string; id: number }[]) {
    this._purposes = value;
  }

  get purposes(): { name: string; id: number }[] {
    return this._purposes;
  }

  set anaerobicDeepLagoons(value: { name: string; id: number }[]) {
    this._anaerobicDeepLagoons = value;
  }

  get anaerobicDeepLagoons(): { name: string; id: number }[] {
    return this._anaerobicDeepLagoons;
  }
  set electricity_units(value: { name: string; id: number }[]) {
    this._units = value;
  }

  get electricity_units(): { name: string; id: number }[] {
    return this._units;
  }


  set countries(value: { name: string; id: number,code:string }[]) {
    this._countries = value;
  }

  get countries(): { name: string; id: number ,code:string}[] {
    return this._countries;
  }

  set sources(value: { name: string; id: number }[]) {
    this._sources = value;
  }

  get sources(): { name: string; id: number}[] {
    return this._sources;
  }

  set industries(value: { name: string; id: number }[]) {
    this._industries = value;
  }

  get industries(): { name: string; id: number}[] {
    return this._industries;
  }

  set tieres(value: { name: string; id: number }[]) {
    this._tieres = value;
  }

  get tieres(): { name: string; id: number}[] {
    return this._tieres;
  }

  set currencies(value: { name: string; id: number }[]) {
    this._currencies = value;
  }

  get currencies(): { name: string; id: number }[] {
    return this._currencies;
  }

  set assessment_type(value: { name: string; id: number }[]) {
    this._assessment_type = value;
  }

  get assessment_type(): { name: string; id: number }[] {
    return this._assessment_type;
  }

  set impact_types(value: { name: string; id: number }[]) {
    this._impact_types = value;
  }

  get impact_types(): { name: string; id: number }[] {
    return this._impact_types;
  }

  set impact_categories(value: { name: string; id: number }[]) {
    this._impact_categories = value;
  }

  get impact_categories(): { name: string; id: number }[] {
    return this._impact_categories;
  }

  set impact_characteristics(value: { name: string; id: number }[]) {
    this._impact_characteristics = value;
  }

  get impact_characteristics(): { name: string; id: number }[] {
    return this._impact_characteristics;
  }
}
