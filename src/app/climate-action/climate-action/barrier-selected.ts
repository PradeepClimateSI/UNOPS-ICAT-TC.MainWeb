import { Barriers, BarriersCategory, Characteristics } from "shared/service-proxies/service-proxies"

export class BarrierSelected {

    category: BarriersCategory;
    barrier: Barriers;
    affectedbyIntervention: boolean;
    characteristics:Characteristics;

}