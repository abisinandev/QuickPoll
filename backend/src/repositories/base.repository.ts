import { Document, Model } from "mongoose";
import { IBaseRepository } from "./interfaces/base-repository.interface";

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {

    constructor(protected readonly model: Model<T>) { }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    async create(data: Partial<T>): Promise<T> {
        const doc = new this.model(data);
        return doc.save();
    }
}