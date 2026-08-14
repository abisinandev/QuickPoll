import { IPoll } from "../../models";
import { IBaseRepository } from "./base-repository.interface";

export interface IPollRepository extends IBaseRepository<IPoll> {
    findActivePolls(): Promise<IPoll[]>;
    createMany(pollsData: Partial<IPoll>[]): Promise<IPoll[]>;
    count(): Promise<number>;
}