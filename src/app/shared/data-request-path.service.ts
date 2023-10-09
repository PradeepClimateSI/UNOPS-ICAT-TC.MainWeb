import { CMAssessmentAnswer, Characteristics, ParameterRequest, ParameterRequestTool } from "shared/service-proxies/service-proxies"
import { MasterDataService } from "./master-data.service"
import { SDG } from "app/Tool/carbon-market/cm-section-three/cm-section-three.component"
import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root',
  })
export class DataRequestPathService {

    sdgs: SDG[]
    constructor(
        private masterDataService: MasterDataService
    ){
        this.sdgs = masterDataService.SDGs
    }

    mapCharacteristic(characteristic: Characteristics) {
        if (characteristic.code === 'LONG_TERM') {
            return 'Macro Level'
        } else if (characteristic.code === 'MEDIUM_TERM') {
            return 'Medium Level'
        } else if (characteristic.code === 'SHORT_TERM') {
            return 'Micro Level'
        } else {
            return characteristic.name
        }
    }

    getInfo(obj: ParameterRequest, tool: ParameterRequestTool){
        let paraId
        let category
        if (tool === ParameterRequestTool.Carbon_Market_Tool) {
            paraId = obj.cmAssessmentAnswer.id;
            category = obj.cmAssessmentAnswer.assessment_question.characteristic.category.code
            let sdg = obj.cmAssessmentAnswer.assessment_question.selectedSdg.name
            let indicator = obj.cmAssessmentAnswer.assessment_question.sdgIndicator
            let startingSituation = obj.cmAssessmentAnswer.assessment_question.startingSituation
            let expectedImpact = obj.cmAssessmentAnswer.assessment_question.expectedImpact
            let justification = obj.cmAssessmentAnswer.assessment_question.comment

            return {
                paraId: paraId, category: category, sdg: sdg, indicator: indicator, startingSituation: startingSituation,
                expectedImpact: expectedImpact, justification: justification
            }
        } else {
            paraId = obj.investmentParameter.id;
            return {
                paraId: paraId
            }
        }
    }

    mapSelectedScore(answer: CMAssessmentAnswer) {
        let category = answer.assessment_question.characteristic.category.code
        if (category === 'SUSTAINED_GHG') {
            let scores = this.masterDataService.GHG_sustained_score
            return scores.find(o => o.code === answer.selectedScore)?.label
        } else if (category === 'SUSTAINED_SD') {
            let scores = this.masterDataService.SDG_sustained_score
            return scores.find(o => o.code === answer.selectedScore)?.label
        } else if (category === 'SCALE_GHG') {
            let score
            if (answer.assessment_question.characteristic.code === 'MACRO_LEVEL'){
                score = this.masterDataService.GHG_scale_score_macro
            } else if (answer.assessment_question.characteristic.code === 'MEDIUM_LEVEL'){
                score = this.masterDataService.GHG_scale_score_medium
            } else {
                score = this.masterDataService.GHG_scale_score_micro
            }
            return score.find(o => o.code === answer.selectedScore)?.label
        } else {
            let scores = this.masterDataService.SDG_scale_score
            return scores.find(o => o.code === answer.selectedScore)?.label
        }
    }
}