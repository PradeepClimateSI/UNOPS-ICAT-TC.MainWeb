import { Injectable } from '@angular/core';
import { SDG } from 'app/Tool/carbon-market/cm-section-three/cm-section-three.component';
import { ScoreDto } from 'shared/service-proxies/service-proxies';

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
  private _level_of_implemetation: MasterDataDto[] = []
  private _impact_covered: {name: string, id: number}[] = []
  private _assessment_method: {name: string, id: number}[] = []
  private _assessment_approach2: {name: string, id: number}[] = []
  private _relevance: {name: string, value: number}[] = []
  private _likelihood: {id: string, value: number}[] = []
  private _outcomeScaleScore: {id: string, value: number | null}[] = []
  private _outcomeSustainedScore: {id: string, value: number | null}[] = []
  private _GHG_scale_score: ScoreDto[] = []
  private _GHG_scale_info: any
  private _SD_scale_info: any
  private _adaptation_scale_info: any
  private _other_invest_ghg_info: any
  private _other_invest_sdg_info: any
  private _other_invest_adaptation_info: any
  private _other_invest_ghg_score_info: any
  private _GHG_scale_score_macro: ScoreDto[] = []
  private _GHG_scale_score_medium: ScoreDto[] = []
  private _GHG_scale_score_micro: ScoreDto[] = []
  private _GHG_sustained_score: ScoreDto[] = []
  private _SDG_scale_score: ScoreDto[] = []
  private _SDG_sustained_score: ScoreDto[] = []
  private _adaptation_scale_score: ScoreDto[] = []
  private _adaptation_sustained_score: ScoreDto[] = []
  private _SDGs: SDG[] = []
  private _score: {name: string, value: number}[] = []
  private _xData: {label: string, value: number}[] = []
  private _yData: {label: string, value: number}[] = []
  private _tools: {id: number, name: string, code: string}[] = []
  private _sdg_priorities: {id: number, name: string, code: string, value: number}[] = []
  private _scale_of_activity: MasterDataDto[] = []
  private _investment_instruments: MasterDataDto[] = []
  private _SDG_color_map: {id: number, sdgNumber: number, color: string}[] = []
  private _Sector_color_map: {id: number, sectorNumber: number, color: string}[] = []
  private _word_limits: {field: string, count: number}[] = []
  public phase_transfrom:{title: string,value:string}[]=[]
    

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
      { id: 11, name: "Behavior", code: "BEHAVIOUR", type: ["NORMS"] },
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
      { id: 1, name: "International", code: "INTERNATIONAL" },
      { id: 2, name: "National/sectoral", code: "NATIONAL" },
      { id: 3, name: "Sub-national/sub-sectoral", code: "SUBNATIONAL" },

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
      {  id: "Unlikely (10-30%)",value:1  },
      {  id: "Possible (30-60%)",value:2 },
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
      {  id: "Outside assessment boundaries",value:99 },

    ]

    this.outcomeSustainedScore = [
      {  id: "3 - Very likely (90-100%)",value:3 },
      {  id: "2 - Likely (60-90%)",value:2  },
      {  id: "1 - Possible (30-60%)",value:1 },
      {  id: "0 - Unlikely (10-30%)",value:0 },
      {  id: "-1 - Very unlikely (0-10%)",value:-1 },
      {  id: "Outside assessment boundaries",value:99 },
    ]

    this.assessment_approach2 = [
      { id: 1, name: "Direct" },
      { id: 2, name: "Indirect" },

    ]



    this.GHG_scale_info = {
      macro: 'Quantitative impacts can also be entered here, using the following indicators as a guide:\n 3 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >0.1% of global emissions in the sector in the latest year for which data is available\n' +
        '2 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >0.05% of global emissions in the sector in the latest year for which data is available\n' +
        '1 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >0.01% of global emissions in the sector in the latest year for which data is available\n' +
        '0 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) <0.01% of global emissions in the sector in the latest year for which data is available\n' +
        '-3 - any emissions increase',
      medium: 'Quantitative impacts can also be entered here, using the following indicators as a guide:\n 3 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >1% of national/sectoral emissions in the latest year for which data is available\n' +
        '2 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) equal to 0.5-1% of national/sectoral emissions in the latest year for which data is available\n' +
        '1 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) equal to 0.1-0.5% of national/sectoral emissions in the latest year for which data is available\n' +
        '0 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) <0.01% of national/sectoral emissions in the latest year for which data is available\n' +
        '-3 - any emissions increase',
      micro: 'Quantitative impacts can also be entered here, using the following indicators as a guide:\n 3 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) >5% of subnational/regional/municipal emissions in the latest year for which data is available\n' +
        '2 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) equal to 1-5% of subnational/regional/municipal emissions in the latest year for which data is available\n' +
        '1 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) equal to 0.5-1% of subnational/regional/municipal emissions in the latest year for which data is available\n' +
        '0 - average reduction in emissions (tCO2e/yr calculated as total estimated reductions over lifetime of the project divided by project lifetime) less than 0.5% of subnational/regional/municipal emissions in the latest year for which data is available\n' +
        '-3 - any emissions increase'
    }

    this.SD_scale_info = {
      macro: 'Quantitative impacts can also be entered here, using the following indicators as a guide:\n 3 - Positive material change of more than 50% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '2 - Positive material change of more than 25% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '1 - Positive material change of more than 5% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '0 - No material change of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-1 - Negative material change of more than 5% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-2 - Negative material change of more than 25% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-3 - Negative material change of more than 50% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area',
      medium: 'Quantitative impacts can also be entered here, using the following indicators as a guide:\n 3 - Positive material change of more than 50% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '2 - Positive material change of more than 25% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '1 - Positive material change of more than 5% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '0 - No material change of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-1 - Negative material change of more than 5% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-2 - Negative material change of more than 25% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-3 - Negative material change of more than 50% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area',
      micro: 'Quantitative impacts can also be entered here, using the following indicators as a guide: \n3 - Positive material change of more than 50% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '2 - Positive material change of more than 25% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '1 - Positive material change of more than 5% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '0 - No material change of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-1 - Negative material change of more than 5% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-2 - Negative material change of more than 25% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area\n' +
        '-3 - Negative material change of more than 50% of the baseline value of the indicator / set of indicators underpinning the SDG in the intervention area'
    }

    this.adaptation_scale_info = {
      macro: 'Quantitative impacts can also be entered here, using the following indicators as a guide:\n 3 - adaptation co-benefit identified and impact is material (indicator value change from baseline to project scenario is above 5%).\n' +
        '2 - adaptation co benefit identified but impact is not material (indicator value change from baseline to project scenario is below 5%).\n' +
        '1 - adaptation co-benefit identified but not measured.\n' +
        '0 - no adaptation co-benefit\n' +
        '-1 - maladaptation identified but not measured.\n' +
        '-2 - maladaptation identified but impact is not material (indicator value change from baseline to project scenario is below 5%).\n' +
        '-3 - maladaptation identified and impact is material (indicator value change from baseline to project scenario is above 5%). ',
      medium: 'Quantitative impacts can also be entered here, using the following indicators as a guide:\n 3 - adaptation co-benefit identified and impact is material (indicator value change from baseline to project scenario is above 5%).\n' +
        '2 - adaptation co benefit identified but impact is not material (indicator value change from baseline to project scenario is below 5%).\n' +
        '1 - adaptation co-benefit identified but not measured.\n' +
        '0 - no adaptation co-benefit\n' +
        '-1 - maladaptation identified but not measured.\n' +
        '-2 - maladaptation identified but impact is not material (indicator value change from baseline to project scenario is below 5%).\n' +
        '-3 - maladaptation identified and impact is material (indicator value change from baseline to project scenario is above 5%). ',
      micro: 'Quantitative impacts can also be entered here, using the following indicators as a guide:\n 3 - adaptation co-benefit identified and impact is material (indicator value change from baseline to project scenario is above 5%).\n' +
        '2 - adaptation co benefit identified but impact is not material (indicator value change from baseline to project scenario is below 5%).\n' +
        '1 - adaptation co-benefit identified but not measured.\n' +
        '0 - no adaptation co-benefit\n' +
        '-1 - maladaptation identified but not measured.\n' +
        '-2 - maladaptation identified but impact is not material (indicator value change from baseline to project scenario is below 5%).\n' +
        '-3 - maladaptation identified and impact is material (indicator value change from baseline to project scenario is above 5%). '
    }

    this.other_invest_ghg_info = '3 - The intervention will result in GHG impacts that represent large emissions reductions, relative to the starting situation, at the level of assessment targeted.\n' +
      '2 - The intervention will result in GHG impacts that represent moderate emissions reductions, relative to the starting situation, at the level of assessment targeted.\n' +
      '1 - The intervention will result in GHG impacts that represent minor emissions reductions, relative to the starting situation, at the level of assessment targeted.\n' +
      '0 - The intervention will not result in GHG impacts relative to the starting situation at the level of assessment targeted.\n' +
      '-1  - The intervention will result in GHG impacts that represent a minor increase in emissions, relative to the starting situation, at the level of assessment targeted.\n' +
      '-2 - The intervention will result in GHG impacts that represent moderate emissions increasing, relative to the starting situation, at the level of assessment targeted.\n' +
      '-3 - The intervention will result in GHG impacts that represent a large increase in emissions, relative to the starting situation, at the level of assessment targeted.'

    this.other_invest_sdg_info = '3 - The intervention will result in large net positive sustainable development impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '2 - The intervention will result in moderate net positive sustainable development impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '1 - The intervention will result in minor net positive sustainable development impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '0 - The intervention will not result in sustainable development impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '-1 - The intervention will result in minor net negative sustainable development impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '-2 - The intervention will result in moderate net negative sustainable development impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '-3 - The intervention will result in large net negative sustainable development impacts, relative to the starting situation, at the level of assessment targeted.'

    this._other_invest_adaptation_info = '3 - The intervention will address the root causes of vulnerability to climate change resulting in large net positive climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '2 - The intervention will result in moderate net positive climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '1 - The intervention will result in minor net positive climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '0 - The intervention will not result in climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '-1 - The intervention will result in minor net negative climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '-2 - The intervention will result in moderate net negative climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.\n' +
      '-3 - The intervention will result in large net negative climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.'

    this.other_invest_ghg_score_info = {
      macro: '3 - reduction in emissions > 0.1% of global emissions\n' +
        '2 - reduction in emissions > 0.05% of global emissions\n' +
        '1 - reduction in emissions > 0.01% of global emissions\n' +
        '0 - reduction in emissions < 0.01% of global emissions\n' +
        '-3 - any emissions increase',
      medium: '3 - reduction in emissions > 1% of national/sectoral emissions\n' +
        '2 - reduction in emissions equal to 0.5 - 1% of national/sectoral emissions\n' +
        '1 - reduction in emissions equal to 0.1 - 0.5% of national/sectoral emissions\n' +
        '0 - reduction in emissions less than 0.1% of national/sectoral emissions\n' +
        '-3 - any emissions increase',
      micro: '3 - reduction in emissions > 5% of subnational/regional/municipal emissions or subsectoral level\n' +
        '2 - reduction in emissions equal to 1 - 5% subnational/regional/municipal emissions or subsectoral level\n' +
        '1 - reduction in emissions equal to 0.5 - 1% of subnational/regional/municipal emissions or subsectoral level\n' +
        '0 - reduction in emissions less than 0.5% of subnational/regional/municipal emissions or subsectoral level\n' +
        '-3 - any emissions increase'
    }

    this.GHG_scale_score_macro = [
      new ScoreDto({ name: '3 - The intervention will result in GHG impacts that represent large emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '3', value: 3 }),
      new ScoreDto({ name: '2 - The intervention will result in GHG impacts that represent moderate emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '2', value: 2 }),
      new ScoreDto({ name: '1 - The intervention will result in GHG impacts that represent minor emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '1', value: 1 }),
      new ScoreDto({ name: '0 - The intervention will not result in GHG impacts relative to the starting situation at the level of assessment targeted.', code: '0', value: 0 }),
      new ScoreDto({name: '-1  - The intervention will result in GHG impacts that represent a minor increase in emissions, relative to the starting situation, at the level of assessment targeted.', code: '-1', value: -1}),
      new ScoreDto({name: '-2 - The intervention will result in GHG impacts that represent moderate emissions increasing, relative to the starting situation, at the level of assessment targeted.', code: '-2', value: -2}),
      new ScoreDto({name: '-3 - The intervention will result in GHG impacts that represent a large increase in emissions, relative to the starting situation, at the level of assessment targeted.', code: '-3', value: -3}),
      new ScoreDto({name: 'Outside assessment boundaries', code: '-99', value: -99})
    ]

    this.GHG_scale_score_medium = [
      new ScoreDto({name: '3 - The intervention will result in GHG impacts that represent large emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '3', value: 3}),
      new ScoreDto({name: '2 - The intervention will result in GHG impacts that represent moderate emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '2', value: 2}),
      new ScoreDto({name: '1 - The intervention will result in GHG impacts that represent minor emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '1', value: 1}),
      new ScoreDto({name: '0 - The intervention will not result in GHG impacts relative to the starting situation at the level of assessment targeted.', code: '0', value: 0}),
      new ScoreDto({name: '-1  - The intervention will result in GHG impacts that represent a minor increase in emissions, relative to the starting situation, at the level of assessment targeted.', code: '-1', value: -1}),
      new ScoreDto({name: '-2 - The intervention will result in GHG impacts that represent moderate emissions increasing, relative to the starting situation, at the level of assessment targeted.', code: '-2', value: -2}),
      new ScoreDto({name: '-3 - The intervention will result in GHG impacts that represent a large increase in emissions, relative to the starting situation, at the level of assessment targeted.', code: '-3', value: -3}),
      new ScoreDto({name: 'Outside assessment boundaries', code: '-99', value: -99})
    ]
    this.GHG_scale_score_micro = [
      new ScoreDto({name: '3 - The intervention will result in GHG impacts that represent large emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '3', value: 3}),
      new ScoreDto({name: '2 - The intervention will result in GHG impacts that represent moderate emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '2', value: 2}),
      new ScoreDto({name: '1 - The intervention will result in GHG impacts that represent minor emissions reductions, relative to the starting situation, at the level of assessment targeted.', code: '1', value: 1}),
      new ScoreDto({name: '0 - The intervention will not result in GHG impacts relative to the starting situation at the level of assessment targeted.', code: '0', value: 0}),
      new ScoreDto({name: '-1  - The intervention will result in GHG impacts that represent a minor increase in emissions, relative to the starting situation, at the level of assessment targeted.', code: '-1', value: -1}),
      new ScoreDto({name: '-2 - The intervention will result in GHG impacts that represent moderate emissions increasing, relative to the starting situation, at the level of assessment targeted.', code: '-2', value: -2}),
      new ScoreDto({name: '-3 - The intervention will result in GHG impacts that represent a large increase in emissions, relative to the starting situation, at the level of assessment targeted.', code: '-3', value: -3}),
      new ScoreDto({name: 'Outside assessment boundaries', code: '-99', value: -99})
    ]
    this.GHG_sustained_score = [
      new ScoreDto({name: '3 - Expected positive impact of over 20 years on the selected scale', code: '3', value: 3}),
      new ScoreDto({name: '2 - Expected positive impact of 11-20 years on the selected scale', code: '2', value: 2}),
      new ScoreDto({name: '1 - Expected positive impact of 0-10 years on the selected scale', code: '1', value: 1}),
      new ScoreDto({name: '0 - No expected impact on the selected scale', code: '0', value: 0}),
      new ScoreDto({name: '-1 - Expected negative impact', code: '-1', value: -1}),
      new ScoreDto({name: 'Outside assessment boundaries', code: '-99', value: -99})
    ]

    this.SDG_scale_score = [
      new ScoreDto({name: '3 - The intervention will result in large net positive sustainable development impacts, relative to the starting situation, at the level of assessment targeted.', code: '3', value: 3}),
      new ScoreDto({name: '2 - The intervention will result in moderate net positive sustainable development impacts, relative to the starting situation, at the level of assessment targeted.', code: '2', value: 2}),
      new ScoreDto({name: '1 - The intervention will result in minor net positive sustainable development impacts, relative to the starting situation, at the level of assessment targeted.', code: '1', value: 1}),
      new ScoreDto({name: '0 - The intervention will not result in sustainable development impacts, relative to the starting situation, at the level of assessment targeted.', code: '0', value: 0}),
      new ScoreDto({name: '-1 - The intervention will result in minor net negative sustainable development impacts, relative to the starting situation, at the level of assessment targeted.', code: '-1', value: -1}),
      new ScoreDto({name: '-2 - The intervention will result in moderate net negative sustainable development impacts, relative to the starting situation, at the level of assessment targeted.', code: '-2', value: -2}),
      new ScoreDto({name: '-3 - The intervention will result in large net negative sustainable development impacts, relative to the starting situation, at the level of assessment targeted.', code: '-3', value: -3}),
      new ScoreDto({name: 'Outside assessment boundaries', code: '-99', value: -99})
    ]
    this.SDG_sustained_score = [
      new ScoreDto({name: '3 - Expected positive impact of over 20 years on the selected scale', code: '3', value: 3}),
      new ScoreDto({name: '2 - Expected positive impact of 11-20 years on the selected scale', code: '2', value: 2}),
      new ScoreDto({name: '1 - Expected positive impact of 0-10 years on the selected scale', code: '1', value: 1}),
      new ScoreDto({name: '0 - No expected impact on the selected scale', code: '0', value: 0}),
      new ScoreDto({name: '-1 - Expected negative impact', code: '-1', value: -1}),
      new ScoreDto({name: 'Outside assessment boundaries', code: '-99', value: -99})
    ]

    this.adaptation_scale_score = [
      new ScoreDto({name: '3 - The intervention will address the root causes of vulnerability to climate change resulting in large net positive climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.', code: '3', value: 3}),
      new ScoreDto({name: '2 - The intervention will result in moderate net positive climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.', code: '2', value: 2}),
      new ScoreDto({name: '1 - The intervention will result in minor net positive climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.', code: '1', value: 1}),
      new ScoreDto({name: '0 - The intervention will not result in climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.', code: '0', value: 0}),
      new ScoreDto({name: '-1 - The intervention will result in minor net negative climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.', code: '-1', value: -1}),
      new ScoreDto({name: '-2 - The intervention will result in moderate net negative climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.', code: '-2', value: -2}),
      new ScoreDto({name: '-3 - The intervention will result in large net negative climate change adaptation impacts, relative to the starting situation, at the level of assessment targeted.', code: '-3', value: -3}),
      new ScoreDto({name: 'Outside assessment boundaries', code: '-99', value: -99})
    ]

    this.adaptation_sustained_score = [
      new ScoreDto({name: '3 - Expected positive impact of over 20 years on the selected scale', code: '3', value: 3}),
      new ScoreDto({name: '2 - Expected positive impact of 11-20 years on the selected scale', code: '2', value: 2}),
      new ScoreDto({name: '1 - Expected positive impact of 0-10 years on the selected scale', code: '1', value: 1}),
      new ScoreDto({name: '0 - No expected impact on the selected scale', code: '0', value: 0}),
      new ScoreDto({name: '-1 - Expected negative impact', code: '-1', value: -1}),
      new ScoreDto({name: 'Outside assessment boundaries', code: '-99', value: -99})
    ]

    this.xData = [
      {label: 'Major', value: 3},
      {label: 'Moderate', value: 2},
      {label: 'Minor', value: 1},
      {label: 'None', value: 0},
      {label: 'Minor negative', value: -1},
      {label: 'Moderate negative', value: -2},
      {label: 'Major negative', value: -3}
    ]
  
    this.yData = [
      {label: 'Very likely', value: 4},
      {label: 'Likely', value: 3},
      {label: 'Possible', value: 2},
      {label: 'Unlikely', value: 1},
      {label: 'Very unlikely', value: 0}
    ]

    this.SDGs= [
      {id: 1, name: 'No poverty', number: 1, code: 'NO_POVERTY', scaleResult: [], sustainResult: []},
      {id: 2, name: 'Zero hunger', number: 2, code: 'ZERO_HUNGER', scaleResult: [], sustainResult: []},
      {id: 3, name: 'Good health and well-being', number: 3, code: 'GOOD_HEALTH_AND_WELL_BEING', scaleResult: [], sustainResult: []},
      {id: 4, name: 'Quality education', number: 4, code: 'QULITY_EDUCATION', scaleResult: [], sustainResult: []},
      {id: 5, name: 'Gender equality', number: 5, code: 'GENDER_EQUALITY', scaleResult: [], sustainResult: []},
      {id: 6, name: 'Clean water and sanitation', number: 6, code: 'CLEAN_WATER_AND_SANITATION', scaleResult: [], sustainResult: []},
      {id: 7, name: 'Affordable and clean energy', number: 7, code: 'AFFORDABLE_AND_CLEAN_ENERGY', scaleResult: [], sustainResult: []},
      {id: 8, name: 'Decent work and economic growth', number: 8, code: 'DECENT_WORK_AND_ECONOMIC_GROWTH', scaleResult: [], sustainResult: []},
      {id: 9, name: 'Industry innovation and infrastructure', number: 9, code: 'INDUSTRY_INNOVATION_AND_INFRASTRUCTURE', scaleResult: [], sustainResult: []},
      {id: 10, name: 'Reduced inequalities', number: 10, code: 'REDUCED_INEQUALITIES', scaleResult: [], sustainResult: []},
      {id: 11, name: 'Sustainable cities and communities', number: 11, code: 'SUSTAINABLE_CITIES_AND_COMMUNIIES', scaleResult: [], sustainResult: []},
      {id: 12, name: 'Responsible consumption and production', number: 12, code: 'RESPONSIBLE_CONSUMPTION_AND_PRODUCTION', scaleResult: [], sustainResult: []},
      {id: 13, name: 'Climate action', number: 13, code: 'CLIMATE_ACTION', scaleResult: [], sustainResult: []},
      {id: 14, name: 'Life below water', number: 14, code: 'LIFE_BELOW_WATER', scaleResult: [], sustainResult: []},
      {id: 15, name: 'Life on land', number: 15, code: 'LIFE_ON_LAND', scaleResult: [], sustainResult: []},
      {id: 16, name: 'Peace, justice and strong institutions', number: 16, code: 'PEACE_JUSTICE_AND_STRING_INSTITUTIONS', scaleResult: [], sustainResult: []},
      {id: 17, name: 'Partnerships for the goals', number: 17, code: 'PARTNERSHIPS_FOR_THE_GOALS', scaleResult: [], sustainResult: []}
    ]

    this.tools = [
      {id: 1, name: 'General tool', code: 'PORTFOLIO'},
      {id: 2, name: 'Carbon market tool', code: 'CARBON_MARKET'},
      {id: 3, name: 'Investment tool', code: 'INVESTOR'},
    ]

    this.sdg_priorities = [
      { id: 1, name: 'High priority', code: 'HIGH', value: 3 },
      { id: 2, name: 'Medium priority', code: 'MEDIUM', value: 2 },
      { id: 3, name: 'Low priority', code: 'LOW', value: 1 },
      { id: 3, name: 'No priority', code: 'NO', value: 0 },
    ]

    this.investment_instruments = [
      { id: 1, name: 'Own capital', code: 'OWN_CAPITAL'},
      { id: 2, name: 'National/subnational budget', code: 'NATIONAL_SUBNATIONAL_BUDGET'},
      { id: 3, name: 'Capital markets', code: 'CAPITAL_MARKETS'},
      { id: 4, name: 'Private Funding/venture capital (national)', code: 'PRIVATE_FUNDING_VENTURE_CAPITAL_NATIONAL'},
      { id: 5, name: 'Private funding/venture capital (inter.)', code: 'PRIVATE_FUNDING_VENTURE_CAPITAL_INTER'},
      { id: 6, name: 'Senior debt', code: 'SENIOR_DEBT'},
      { id: 7, name: 'Green bonds', code: 'GREEN_BONDS'},
      { id: 8, name: 'Blended finance', code: 'BLENDED_FINANCE'},
      { id: 9, name: 'Grants (ODA)', code: 'GRANTS_ODA'},
      { id: 10, name: 'Concesional loans (ODA)', code: 'CONCESIONAL_LOANS_ODA'},
      { id: 11, name: 'Investment loans', code: 'INVESTMENT_LOANS'},
      { id: 12, name: 'Credit lines', code: 'CREDIT_LINES'},
      { id: 13, name: 'Other', code: 'OTHER'},
    ]

    this.scale_of_activity = [
      { id: 1, name: 'Project', code: 'PROJECT'},
      { id: 2, name: 'Programme', code: 'PROGRAMME'}
    ]

    this.SDG_color_map = [
      {id: 1, sdgNumber: 1, color: '#e5233d'},
      {id: 2, sdgNumber: 2, color: '#dda73a'},
      {id: 3, sdgNumber: 3, color: '#4ca146'},
      {id: 4, sdgNumber: 4, color: '#c5192d'},
      {id: 5, sdgNumber: 5, color: '#ef402c'},
      {id: 6, sdgNumber: 6, color: '#27bfe6'},
      {id: 7, sdgNumber: 7, color: '#fbc412'},
      {id: 8, sdgNumber: 8, color: '#a31c44'},
      {id: 9, sdgNumber: 9, color: '#f26a2d'},
      {id: 10, sdgNumber: 10, color: '#e01483'},
      {id: 11, sdgNumber: 11, color: '#f89d2a'},
      {id: 12, sdgNumber: 12, color: '#bf8d2c'},
      {id: 13, sdgNumber: 13, color: '#407f46'},
      {id: 14, sdgNumber: 14, color: '#1f97d4'},
      {id: 15, sdgNumber: 15, color: '#59ba48'},
      {id: 16, sdgNumber: 16, color: '#126a9f'},
      {id: 17, sdgNumber: 17, color: '#13496b'},
    ]

    this.Sector_color_map = [
      {id: 1, sectorNumber: 1, color: '#003360'},
      {id: 2, sectorNumber: 3, color: '#A52A2A'},
      {id: 3, sectorNumber: 2, color: '#C0C0C0'},
      {id: 4, sectorNumber: 5, color: '#8B4513'},
      {id: 5, sectorNumber: 4, color: '#808080'},
      {id: 6, sectorNumber: 6, color: '#008000'},
      {id: 7, sectorNumber: 7, color: '#007BA7'},
      {id: 8, sectorNumber: 8, color: '#483C32'},
    ]

    this.word_limits = [
      {field: FieldNames.INTERVENTION_TITLE, count: 150},
      {field: FieldNames.INTERVENTION_DESCRIPTION, count: 1500},
      {field: FieldNames.INTERVENTION_OBJECTIVE, count: 1500},
      {field: FieldNames.IMPLEMENTING_ENTITY, count: 500},
      {field: FieldNames.GEOGRAPHICAL_COVERAGE, count: 1500},
      {field: FieldNames.RELATED_INTERVENTION, count: 1500},
      {field: FieldNames.REFERENCE, count: 1500},
      {field: FieldNames.ASSESSMENT_OPPORTUNITIES, count: 1500},
      {field: FieldNames.BARRIER, count: 150},
      {field: FieldNames.BARRIER_EXPLANATION, count: 1500},
      {field: FieldNames.VISION, count: 1500},
      {field: FieldNames.JUSTIFICATION, count: 1000},
    ]

    this.phase_transfrom =[
      { title: 'Pre-development', value: 'The pre-development phase is characterized by, on the one hand, visible and increasing pressure to make moves towards low-carbon and sustainable development and, on the other hand, by stability and a status quo, in which predominant paradigms are rarely challenged, and institutions are stagnant.' },
      { title: 'Take-off', value: 'In the take-off phase, there are observable moves to change the system towards more openness and acceptance of new ideas and concepts that question or challenge existing high-carbon paradigms.' },
      { title: 'Acceleration', value: 'In the acceleration phase, new solutions or innovations gain momentum and challenge the status quo. Alternative solutions have become widespread, and are accepted and acknowledged.' },
      { title: 'Stabilization or relapse', value: 'In the stabilization phase, the system is fully transformed, and the new pathways are embraced broadly in society and the economy. However, the risk of relapse is high if the interests of the high-carbon regime remain active, and continued efforts may be needed to maintain momentum' },
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
  set level_of_implemetation(value: MasterDataDto[]) {
    this._level_of_implemetation = value;
  }

  get level_of_implemetation (): MasterDataDto[] {
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

  set GHG_scale_info(value: any) {
    this._GHG_scale_info = value;
  }

  get GHG_scale_info (): any {
    return this._GHG_scale_info;
  }

  set SD_scale_info(value: any) {
    this._SD_scale_info = value;
  }

  get SD_scale_info (): any {
    return this._SD_scale_info;
  }

  set adaptation_scale_info(value: any) {
    this._adaptation_scale_info = value;
  }

  get adaptation_scale_info (): any {
    return this._adaptation_scale_info;
  }

  set other_invest_ghg_info(value: any) {
    this._other_invest_ghg_info = value;
  }

  get other_invest_ghg_info (): any {
    return this._other_invest_ghg_info;
  }

  set other_invest_sdg_info(value: any) {
    this._other_invest_sdg_info = value;
  }

  get other_invest_sdg_info (): any {
    return this._other_invest_sdg_info;
  }

  set other_invest_adaptation_info(value: any) {
    this._other_invest_adaptation_info= value;
  }

  get other_invest_adaptation_info (): any {
    return this._other_invest_adaptation_info;
  }

  set other_invest_ghg_score_info(value: any) {
    this._other_invest_ghg_score_info= value;
  }

  get other_invest_ghg_score_info (): any {
    return this._other_invest_ghg_score_info;
  }

  set GHG_scale_score_macro(value: ScoreDto[]) {
    this._GHG_scale_score_macro = value;
  }

  get GHG_scale_score_macro (): ScoreDto[] {
    return this._GHG_scale_score_macro;
  }

  set GHG_scale_score_medium(value: ScoreDto[]) {
    this._GHG_scale_score_medium = value;
  }

  get GHG_scale_score_medium (): ScoreDto[] {
    return this._GHG_scale_score_medium;
  }

  set GHG_scale_score_micro(value: ScoreDto[]) {
    this._GHG_scale_score_micro = value;
  }

  get GHG_scale_score_micro (): ScoreDto[] {
    return this._GHG_scale_score_micro;
  }

  set GHG_sustained_score(value: ScoreDto[]) {
    this._GHG_sustained_score = value;
  }

  get GHG_sustained_score (): ScoreDto[] {
    return this._GHG_sustained_score;
  }

  set SDG_scale_score(value: ScoreDto[]) {
    this._SDG_scale_score = value;
  }

  get SDG_scale_score (): ScoreDto[] {
    return this._SDG_scale_score;
  }

  set SDG_sustained_score(value: ScoreDto[]) {
    this._SDG_sustained_score = value;
  }

  get SDG_sustained_score (): ScoreDto[] {
    return this._SDG_sustained_score;
  }

  set adaptation_scale_score(value: ScoreDto[]) {
    this._adaptation_scale_score = value;
  }

  get adaptation_scale_score (): ScoreDto[] {
    return this._adaptation_scale_score;
  }

  set adaptation_sustained_score(value: ScoreDto[]) {
    this._adaptation_sustained_score = value;
  }

  get adaptation_sustained_score (): ScoreDto[] {
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

  set tools(value: {id: number; name: string; code: string}[]) {
    this._tools = value;
  }

  get tools (): {id: number; name: string; code: string}[] {
    return this._tools;
  }

  set sdg_priorities(value: {id: number; name: string; code: string; value: number}[]) {
    this._sdg_priorities = value;
  }

  get sdg_priorities (): {id: number; name: string; code: string; value: number}[] {
    return this._sdg_priorities;
  }

  set scale_of_activity(value: MasterDataDto[]) {
    this._scale_of_activity = value;
  }

  get scale_of_activity (): MasterDataDto[] {
    return this._scale_of_activity;
  }

  set investment_instruments(value: MasterDataDto[]) {
    this._investment_instruments = value;
  }

  get investment_instruments (): MasterDataDto[] {
    return this._investment_instruments;
  }

  set SDG_color_map(value: {id: number; sdgNumber: number; color: string;}[]) {
    this._SDG_color_map = value;
  }

  get SDG_color_map (): {id: number; sdgNumber: number; color: string;}[] {
    return this._SDG_color_map;
  }

  set Sector_color_map(value: {id: number; sectorNumber: number; color: string;}[]) {
    this._Sector_color_map = value;
  }

  get Sector_color_map (): {id: number; sectorNumber: number; color: string;}[] {
    return this._Sector_color_map;
  }

  set word_limits(value: {field: string; count: number;}[]) {
    this._word_limits = value;
  }

  get word_limits (): {field: string; count: number;}[] {
    return this._word_limits;
  }
  

  getToolName(code: string) {
    let tool = this.tools.find(o => o.code === code)
    if (tool) {
      return tool.name
    } else {
      return ''
    }
  }

  getFieldCharCount(field: FieldNames) {
    let limit = this.word_limits.find(o => o.field === field);
    if (limit) {
      return limit.count;
    } else {
      return 255;
    }
  }
}

export class MasterDataDto{
  id: number
  name: string
  code: string
}

export enum FieldNames {
  INTERVENTION_TITLE = "INTERVENTION_TITLE",
  INTERVENTION_DESCRIPTION = "INTERVENTION_DESCRIPTION",
  IMPLEMENTING_ENTITY = "IMPLEMENTING_ENTITY",
  INTERVENTION_OBJECTIVE = "INTERVENTION_OBJECTIVE",
  GEOGRAPHICAL_COVERAGE = "GEOGRAPHICAL_COVERAGE",
  RELATED_INTERVENTION = "RELATED_INTERVENTION",
  REFERENCE = "REFERENCE",
  VISION = "VISION",
  BARRIER = "BARRIER",
  BARRIER_EXPLANATION = "BARRIER_EXPLANATION",
  ASSESSMENT_OPPORTUNITIES = "ASSESSMENT_OPPORTUNITIES",
  JUSTIFICATION = "JUSTIFICATION"
}

export const chapter6_url = 'https://storage.googleapis.com/tc-toolkit-public-files/public/Transformational-Change-Methodology_ch6.pdf'
export const assessment_period_info = 'This refers to the timeframe, for which the intervention\'s impact is assessed - NOT when the assessment is conducted.\n' +
  'The period cannot begin earlier than the start date that was selected for the intervention. It can be different from the implementation period and should include the full range ' +
  'of relevant impacts.\n' +
  'System changes usually unfold over a longer period of time than individual impacts. Hence, users are encouraged to select a long assessment period (e.g. 15 years or more, with ' +
  'an end date such as 2040 or 2050) to align with longer term plans and goals.'
