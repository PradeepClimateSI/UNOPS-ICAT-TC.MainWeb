import { Injectable } from '@angular/core';
import { SDG } from 'app/Tool/carbon-market/cm-section-three/cm-section-three.component';
import { SelectedScoreDto } from './score.dto';

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
  private _sdg_answers: {name: string, id: number}[] = []
  private _assessment_approach: {name: string, id: number, code: string}[] = []
  private _impact_types: {name: string, id: number, code: string}[] = []
  private _int_cm_approaches: {name: string, id: number, code: string}[] = []
  private _sectorial_boundries: {name: string, id: number, code: string}[] = []
  private _impact_categories: {name: string, id: number, code: string, type: string}[] = []
  private _impact_characteristics: {name: string, id: number, code: string, type: string[]}[] = []
  private _level_of_implemetation: {name: string, id: number}[] = []
  private _impact_covered: {name: string, id: number}[] = []
  private _assessment_method: {name: string, id: number}[] = []
  private _assessment_approach2: {name: string, id: number}[] = []
  private _relevance: {name: string, value: number}[] = []
  private _likelihood: {id: string, value: number}[] = []
  private _outcomeScaleScore: {id: string, value: number | null}[] = []
  private _outcomeSustainedScore: {id: string, value: number | null}[] = []
  private _GHG_scale_score: SelectedScoreDto[] = []
  private _GHG_scale_score_macro: SelectedScoreDto[] = []
  private _GHG_scale_score_medium: SelectedScoreDto[] = []
  private _GHG_scale_score_micro: SelectedScoreDto[] = []
  private _GHG_sustained_score: SelectedScoreDto[] = []
  private _SDG_scale_score: SelectedScoreDto[] = []
  private _SDG_sustained_score: SelectedScoreDto[] = []
  private _adaptation_scale_score: SelectedScoreDto[] = []
  private _adaptation_sustained_score: SelectedScoreDto[] = []
  private _SDGs: SDG[] = []
  private _score: {name: string, value: number}[] = []
  private _xData: {label: string, value: number}[] = []
  private _yData: {label: string, value: number}[] = []


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

    this.sdg_answers = [
      { id: 1, name: "Yes" },
      { id: 2, name: "No" }
    ]

    this.assessment_approach = [
      { id: 1, name: "Direct", code: "DIRECT" },
      { id: 2, name: "Indirect", code: "INDIRECT" }
    ]

    this.sectorial_boundries = [
      { id: 1, name: "Energy", code: "ENERGY" },
      { id: 2, name: "Transport", code: "TRANSPORT" },
      { id: 3, name: "Agriculture", code: "AGRICULTURE" },
      { id: 4, name: "LULUCF", code: "LULUCF" },
      { id: 5, name: "Industry", code: "INDUSTRY" }
    ]
    this.impact_types = [
      { id: 1, name: "Process", code: "PROCESS" },
      { id: 2, name: "Outcomes", code: "OUTCOMES" }
    ]
    this.int_cm_approaches = [
      { id: 1, name: "Article 6.2", code: "ARTICLE_6.2" },
      { id: 2, name: "Article 6.4", code: "ARTICLE_6.4" },
      { id: 2, name: "Gold Standard", code: "GOLD_STANDARD" },
      { id: 2, name: "Verified Carbon Standard", code: "VERIFIED_CARBON_STANDARD" },
      { id: 2, name: "Plan Vivo", code: "PLAN_VIVO" },
      { id: 2, name: "American Carbon Registry", code: "AMERICAN_CARBON_REGISTRY" },
      { id: 2, name: "Climate Action Reserve", code: "CLIMATE_ACTION_RESERVE" },
      { id: 2, name: "Other", code: "OTHER" },
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
      { id: 2, name: "National/sectorial" },
      { id: 3, name: "Sub-national/sub-sectorial" },

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
      {  name: "Relevant ",value:2 },
      {  name: "Possibly Relevant ",value:1 },
      {  name: "Not Relevant ",value:0 },
    ]
    this.score = [
      {  name: "3 - Major",value:3 },
      {  name: "2 - Moderate",value:2 },
      {  name: "1 - Minor",value:1 },
      {  name: "0 - None",value:0 },
      {  name: "-1 - Minor Negative",value:-1 },
      {  name: "-2 - Moderate Negative",value:-2 },
      {  name: "-3 - Major Negative",value:-3 },
    ]

    this.likelihood = [
      {  id: "Very unlikely (0-10%)",value:0 },
      {  id: "Unlikely (10-33%)",value:1  },
      {  id: "Possible (33-66%)",value:2 },
      {  id: "Likely (60-90%)",value:3 },
      {  id: "Very likely (90-100%)",value:4 },

    ]

    this.outcomeScaleScore = [
      {  id: "3 - Major",value:3 },
      {  id: "2 - Moderate",value:2  },
      {  id: "1 - Minor",value:1 },
      {  id: "0 - None",value:0 },
      {  id: "-1 - Minor Negative",value:-1 },
      {  id: "-2 - Moderate Negative",value:-2 },
      {  id: "-3 - Major Negative",value:-3 },
      {  id: "Empty",value:null },

    ]

    this.outcomeSustainedScore = [
      {  id: "Very likely (90-100%)",value:3 },
      {  id: "Likely (60-90%)",value:2  },
      {  id: "Possible (33-66%)",value:1 },
      {  id: "Less likely (10-33%)",value:0 },
      {  id: "Unlikely (0-10%)",value:-1 },
      {  id: "Empty",value:null },
    ]

    this.assessment_approach2 = [
      { id: 1, name: "Direct" },
      { id: 2, name: "Indirect" },

    ]


    this.GHG_scale_score_macro = [
      {label: '3 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >0.1% of global emissions in the latest year for which data is available', code: '3', value: 3},
      {label: '2 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >0.05% of global emissions in the latest year for which data is available', code: '2', value: 2},
      {label: '1 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >0.01% of global emissions in the latest year for which data is available', code: '1', value: 1},
      {label: '0 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) <0.1% of global emissions in the latest year for which data is available', code: '0', value: 0},
      {label: '-3 - any emissions increase', code: '-3', value: -3}
    ]
    this.GHG_scale_score_medium = [
      {label: '3 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >1% of national/sectoral emissions in the latest year for which data is available', code: '3', value: 3},
      {label: '2 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) equal to 0.5-1% of national/sectoral emissions in the latest year for which data is available', code: '2', value: 2},
      {label: '1 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) equal to 0.1-0.5% of national/sectoral emissions in the latest year for which data is available', code: '1', value: 1},
      {label: '0 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) <0.1% of national/sectoral emissions in the latest year for which data is available', code: '0', value: 0},
      {label: '-3 - any emissions increase', code: '-3', value: -3}
    ]
    this.GHG_scale_score_micro = [
      {label: '3 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >5% of subnational/regional/municipal emissions in the latest year for which data is available', code: '3', value: 3},
      {label: '2 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) equal to 1-5% of subnational/regional/municipal emissions in the latest year for which data is available', code: '2', value: 2},
      {label: '1 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) equal to 0.5-1% of subnational/regional/municipal emissions in the latest year for which data is available', code: '1', value: 1},
      {label: '0 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) less than 0.5% of subnational/regional/municipal emissions in the latest year for which data is available', code: '0', value: 0},
      {label: '-3 - any emissions increase', code: '-3', value: -3}
    ]
    this.GHG_sustained_score = [
      {label: '3 - Expected positive impact of over 20 years on the selected scale', code: '3', value: 3},
      {label: '2 - Expected positive impact of 11-20 years on the selected scale', code: '2', value: 2},
      {label: '1 - Expected positive impact of 0-10 years on the selected scale', code: '1', value: 1},
      {label: '0 - No expected impact on the selected scale', code: '0', value: 0},
      {label: '-1 - Expected negative impact', code: '-1', value: -1}
    ]
    this.SDG_scale_score = [
      {label: '3 - Positive material change of more than 50% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area', code: '3', value: 3},
      {label: '2 - Positive material change of more than 25% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area', code: '2', value: 2},
      {label: '1 - Positive material change of more than 5% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area', code: '1', value: 1},
      {label: '0 - No material change of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area', code: '0', value: 0},
      {label: '-1 - Negative material change of more than 5% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area', code: '-1', value: -1},
      {label: '-2 - Negative material change of more than 25% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area', code: '-2', value: -2},
      {label: '-3 - Negative material change of more than 50% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area', code: '-3', value: -3},
    ]
    this.SDG_sustained_score = [
      {label: '3 - Expected positive impact of over 20 years on the selected scale', code: '3', value: 3},
      {label: '2 - Expected positive impact of 11-20 years on the selected scale', code: '2', value: 2},
      {label: '1 - Expected positive impact of 0-10 years on the selected scale', code: '1', value: 1},
      {label: '0 - No expected impact on the selected scale', code: '0', value: 0},
      {label: '-1 - Expected negative impact', code: '-1', value: -1},
    ]

    this.adaptation_scale_score = [
      {label: '3 - adaptation co-benefit identified and impact is material (indicator value change from baseline to project scenario is above 5%).', code: '3', value: 3},
      {label: '2 - adaptation co benefit identified but impact is not material (indicator value change from baseline to project scenario is below 5%).', code: '2', value: 2},
      {label: '1 - adaptation co-benefit identified but not measured.).', code: '1', value: 1},
      {label: '0 - no adaptation co-benefit', code: '0', value: 0},
      {label: '-1 - maladaptation identified but not measured.', code: '-1', value: -1},
      {label: '-2 - maladaptation identified but impact is not material (indicator value change from baseline to project scenario is below 5%).', code: '-2', value: -2},
      {label: '-3 - maladaptation identified and impact is material (indicator value change from baseline to project scenario is above 5%). ', code: '-3', value: -3},
    ]

    this.adaptation_sustained_score = [
      {label: '3 - Expected positive impact of over 20 years on the selected scale', code: '3', value: 3},
      {label: '2 - Expected positive impact of 11-20 years on the selected scale', code: '2', value: 2},
      {label: '1 - Expected positive impact of 0-10 years on the selected scale', code: '1', value: 1},
      {label: '0 - No expected impact on the selected scale', code: '0', value: 0},
      {label: '-1 - Expected negative impact', code: '-1', value: -1},
    ]

    this.xData = [
      {label: '3 - Major', value: 3},
      {label: '2 - Moderate', value: 2},
      {label: '1 - Minor', value: 1},
      {label: '0 - None', value: 0},
      {label: '-1 - Minor Negative', value: -1},
      {label: '-2 - Moderate Negative', value: -2},
      {label: '-3 - Major Negative', value: -3}
    ]
  
    this.yData = [
      {label: '4 - Very likely (90-100%)', value: 4},
      {label: '3 - Likely (60-90%)', value: 3},
      {label: '2 - Possible (33-66%)', value: 2},
      {label: '1 - Unlikely (10-33%)', value: 1},
      {label: '0 - Very Unlikely (0-10%)', value: 0}
    ]

    this.SDGs= [
      {name: 'No poverty', code: 'NO_POVERTY', scaleResult: [], sustainResult: []},
      {name: 'Zero hunger', code: 'ZERO_HUNGER', scaleResult: [], sustainResult: []},
      {name: 'Good health and well-being', code: 'GOOD_HEALTH_AND_WELL_BEING', scaleResult: [], sustainResult: []},
      {name: 'Quality education', code: 'QULITY_EDUCATION', scaleResult: [], sustainResult: []},
      {name: 'Gender equality', code: 'GENDER_EQUALITY', scaleResult: [], sustainResult: []},
      {name: 'Clean water and sanitation', code: 'CLEAN_WATER_AND_SANITATION', scaleResult: [], sustainResult: []},
      {name: 'Affordable and clean energy', code: 'AFFORDABLE_AND_CLEAN_ENERGY', scaleResult: [], sustainResult: []},
      {name: 'Decent work and economic growth', code: 'DECENT_WORK_AND_ECONOMIC_GROWTH', scaleResult: [], sustainResult: []},
      {name: 'Industry innovation and infrastructure', code: 'INDUSTRY_INNOVATION_AND_INFRASTRUCTURE', scaleResult: [], sustainResult: []},
      {name: 'Reduced inequalities', code: 'REDUCED_INEQUALITIES', scaleResult: [], sustainResult: []},
      {name: 'Sustainable cities and communities', code: 'SUSTAINABLE_CITIES_AND_COMMUNIIES', scaleResult: [], sustainResult: []},
      {name: 'Responsible consumption and production', code: 'RESPONSIBLE_CONSUMPTION_AND_PRODUCTION', scaleResult: [], sustainResult: []},
      {name: 'Climate action', code: 'CLIMATE_ACTION', scaleResult: [], sustainResult: []},
      {name: 'Life below water', code: 'LIFE_BELOW_WATER', scaleResult: [], sustainResult: []},
      {name: 'Life on land', code: 'LIFE_ON_LAND', scaleResult: [], sustainResult: []},
      {name: 'Peace, justice and strong institutions', code: 'PEACE_JUSTICE_AND_STRING_INSTITUTIONS', scaleResult: [], sustainResult: []},
      {name: 'Partnerships for the goals', code: 'PARTNERSHIPS_FOR_THE_GOALS', scaleResult: [], sustainResult: []}
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

  set sdg_answers(value: { name: string; id: number }[]) {
    this._sdg_answers = value;
  }

  get sdg_answers(): { name: string; id: number }[] {
    return this._sdg_answers;
  }

  set assessment_approach(value: { name: string; id: number; code: string }[]) {
    this._assessment_approach = value;
  }

  get assessment_approach(): { name: string; id: number; code: string }[] {
    return this._assessment_approach;
  }

  set sectorial_boundries(value: { name: string; id: number, code: string }[]) {
    this._sectorial_boundries = value;
  }

  get sectorial_boundries(): { name: string; id: number, code: string }[] {
    return this._sectorial_boundries;
  }

  set impact_types(value: { name: string; id: number, code: string }[]) {
    this._impact_types = value;
  }

  get impact_types(): { name: string; id: number, code: string }[] {
    return this._impact_types;
  }

  set int_cm_approaches(value: { name: string; id: number, code: string }[]) {
    this._int_cm_approaches = value;
  }

  get int_cm_approaches(): { name: string; id: number, code: string }[] {
    return this._int_cm_approaches;
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
  set score(value: { name: string; value: number }[]) {
    this._score = value;
  }

  get score (): { name: string; value: number }[] {
    return this._score;
  }

  set likelihood(value: { id: string; value: number}[]) {
    this._likelihood = value;
  }

  get likelihood (): { id: string; value: number }[] {
    return this._likelihood;
  }

  set outcomeScaleScore(value: { id: string; value: number | null}[]) {
    this._outcomeScaleScore = value;
  }

  get outcomeScaleScore (): { id: string; value: number | null }[] {
    return this._outcomeScaleScore;
  }

  set outcomeSustainedScore(value: { id: string; value: number | null}[]) {
    this._outcomeSustainedScore = value;
  }

  get outcomeSustainedScore (): { id: string; value: number | null}[] {
    return this._outcomeSustainedScore;
  }

  set assessment_approach2(value: { name: string; id: number }[]) {
    this._assessment_approach2 = value;
  }

  get assessment_approach2 (): { name: string; id: number }[] {
    return this._assessment_approach;
  }

  set GHG_scale_score_macro(value: SelectedScoreDto[]) {
    this._GHG_scale_score_macro = value;
  }

  get GHG_scale_score_macro (): SelectedScoreDto[] {
    return this._GHG_scale_score_macro;
  }

  set GHG_scale_score_medium(value: SelectedScoreDto[]) {
    this._GHG_scale_score_medium = value;
  }

  get GHG_scale_score_medium (): SelectedScoreDto[] {
    return this._GHG_scale_score_medium;
  }

  set GHG_scale_score_micro(value: SelectedScoreDto[]) {
    this._GHG_scale_score_micro = value;
  }

  get GHG_scale_score_micro (): SelectedScoreDto[] {
    return this._GHG_scale_score_micro;
  }

  set GHG_sustained_score(value: SelectedScoreDto[]) {
    this._GHG_sustained_score = value;
  }

  get GHG_sustained_score (): SelectedScoreDto[] {
    return this._GHG_sustained_score;
  }

  set SDG_scale_score(value: SelectedScoreDto[]) {
    this._SDG_scale_score = value;
  }

  get SDG_scale_score (): SelectedScoreDto[] {
    return this._SDG_scale_score;
  }

  set SDG_sustained_score(value: SelectedScoreDto[]) {
    this._SDG_sustained_score = value;
  }

  get SDG_sustained_score (): SelectedScoreDto[] {
    return this._SDG_sustained_score;
  }

  set adaptation_scale_score(value: SelectedScoreDto[]) {
    this._adaptation_scale_score = value;
  }

  get adaptation_scale_score (): SelectedScoreDto[] {
    return this._adaptation_scale_score;
  }

  set adaptation_sustained_score(value: SelectedScoreDto[]) {
    this._adaptation_sustained_score = value;
  }

  get adaptation_sustained_score (): SelectedScoreDto[] {
    return this._adaptation_sustained_score;
  }

  set xData(value: {label: string; value: number}[]) {
    this._xData = value;
  }

  get xData (): {label: string; value: number}[] {
    return this._xData;
  }

  set yData(value: {label: string; value: number}[]) {
    this._yData = value;
  }

  get yData (): {label: string; value: number}[] {
    return this._yData;
  }

  set SDGs(value: SDG[]) {
    this._SDGs = value;
  }

  get SDGs (): SDG[] {
    return this._SDGs;
  }
}
