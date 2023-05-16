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
  private _impact_types: {name: string, id: number, code: string}[] = []
  private _impact_categories: {name: string, id: number, code: string, type: string}[] = []
  private _impact_characteristics: {name: string, id: number, code: string, type: string[]}[] = []
  private _level_of_implemetation: {name: string, id: number}[] = []
  private _impact_covered: {name: string, id: number}[] = []
  private _assessment_method: {name: string, id: number}[] = []
  private _relevance: {name: string, value: number}[] = []
  private _likelihood: {id: string, value: number}[] = []





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
      { id: 1, name: "Process", code: "PROCESS" },
      { id: 2, name: "outcomes", code: "OUTCOMES" }
    ]
    this.impact_categories = [
      { id: 1, name: "Technology", code: "TECHNOLOGY", type: "PROCESS" },
      { id: 2, name: "Agents", code: "AGENTS", type: "PROCESS" },
      { id: 3, name: "Incentives", code: "INCENTIVES", type: "PROCESS"},
      { id: 4, name: "Norms", code: "NORMS", type: "PROCESS" },
      { id: 5, name: "Scale of outcome", code: "SCALE_OF_OUTCOME", type: "OUTCOMES" },
      { id: 6, name: "Sustained nature of outcome", code: "SUSTAINED_NATURE_OF_OUTCOME", type: "OUTCOMES" }
    ]
    this.impact_characteristics = [
      { id: 1, name: "Research and development", code: "REESEARCH_AND_DEVELOPMEMNT", type: ["TECHNOLOGY"] },
      { id: 2, name: "Adoption", code: "ADOPTION", type: ["TECHNOLOGY"] },
      { id: 3, name: "Scale-up", code: "SCALE_UP", type: ["TECHNOLOGY"] },
      { id: 4, name: "Entrepreneurs", code: "ENTREPRENEURS", type: ["AGENTS"] },
      { id: 5, name: "Coalitions of advocates", code: "COALITIONS_OF_ADVOCATES", type: ["AGENTS"] },
      { id: 6, name: "Beneficiaries", code: "BENEFICIARIES", type:[ "AGENTS"] },
      { id: 7, name: "Economic and non-economic", code: "ECONOMIC_AND_NON_ECONOMIC" , type: ["INCENTIVES"]},
      { id: 8, name: "Disincentives", code: "DISINCENTIVES", type:[ "INCENTIVES"] },
      { id: 9, name: "Institutional and regulatory", code: "INSTITUTIONAL_AND_REGULATORY", type: ["INCENTIVES"] },
      { id: 10, name: "Awareness", code: "AWARENESS", type: ["NORMS"] },
      { id: 11, name: "Behaviour", code: "BEHAVIOUR", type: ["NORMS"] },
      { id: 12, name: "Social norms", code: "SOCIAL_NORMS", type: ["NORMS"] },
      { id: 13, name: "Macro level", code: "MACRO_LEVEL", type: ["SCALE_OF_OUTCOME"] },
      { id: 14, name: "Medium level", code: "MEDIUM_LEVEL", type: ["SCALE_OF_OUTCOME"] },
      { id: 15, name: "Micro level", code: "MICRO_LEVEL", type: ["SCALE_OF_OUTCOME"] },
      { id: 16, name: "Long term", code: "LONG_TERM" , type: ["SUSTAINED_NATURE_OF_OUTCOME"]},
      { id: 17, name: "Medium term", code: "MEDIUM_TERM", type: ["SUSTAINED_NATURE_OF_OUTCOME"] },
      { id: 18, name: "Short term", code: "SHORT_TERM", type: ["SUSTAINED_NATURE_OF_OUTCOME"] },
      { id: 19, name: "Other", code: "OTHER" , type: ["TECHNOLOGY", "AGENTS", "INCENTIVES","NORMS"]},
    ]

    this.level_of_implemetation = [
      { id: 1, name: "International" },
      { id: 2, name: "National" },
      { id: 3, name: "Sub-national" },

    ]

    this.impact_covered = [
      { id: 1, name: "CC Mitigation" },
      { id: 2, name: "Water quality" },
      { id: 3, name: "Soil quality" },
      { id: 4, name: "Energy" },
      { id: 5, name: "Standard of living" },
      { id: 6, name: "Jobs" },
      { id: 7, name: "Racial equality" },

    ]
    this.assessment_method = [
      { id: 1, name: "Track 1" },
      // { id: 2, name: "Track 2" },
      // { id: 3, name: "Track 3" },
      // { id: 4, name: "Track 4" },

    ]

    this.relevance = [
      {  name: "Relevant",value:2 },
      {  name: "Possibly Relevant",value:1 },
      {  name: "Not Relevant",value:0 },
    ]

    this.likelihood = [
      {  id: "0",value:0 },
      {  id: "1",value:1 },
      {  id: "2",value:2 },
      {  id: "3",value:3 },
      {  id: "4",value:4 },

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

  set impact_types(value: { name: string; id: number, code: string }[]) {
    this._impact_types = value;
  }

  get impact_types(): { name: string; id: number, code: string }[] {
    return this._impact_types;
  }

  set impact_categories(value: { name: string; id: number, code: string, type: string }[]) {
    this._impact_categories = value;
  }

  get impact_categories(): { name: string; id: number, code: string, type: string }[] {
    return this._impact_categories;
  }

  set impact_characteristics(value: { name: string; id: number, code: string, type: string[] }[]) {
    this._impact_characteristics = value;
  }

  get impact_characteristics(): { name: string; id: number, code: string, type: string[] }[] {
    return this._impact_characteristics;
  }
  set level_of_implemetation (value: { name: string; id: number }[]) {
    this._level_of_implemetation = value;
  }

  get level_of_implemetation (): { name: string; id: number }[] {
    return this._level_of_implemetation;
  }

  set impact_covered(value: { name: string; id: number }[]) {
    this._impact_covered = value;
  }

  get impact_covered (): { name: string; id: number }[] {
    return this._impact_covered;
  }

  set assessment_method(value: { name: string; id: number }[]) {
    this._assessment_method = value;
  }

  get assessment_method (): { name: string; id: number }[] {
    return this._assessment_method;
  }

  set relevance(value: { name: string; value: number }[]) {
    this._relevance = value;
  }

  get relevance (): { name: string; value: number }[] {
    return this._relevance;
  }

  set likelihood(value: { id: string; value: number }[]) {
    this._likelihood = value;
  }

  get likelihood (): { id: string; value: number }[] {
    return this._likelihood;
  }



}
