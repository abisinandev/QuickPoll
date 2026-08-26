import { IPollRepository } from "../repositories/interfaces/poll-repository.interfaces";

/**
* Seed predefined polls if none exist.
*/
export class PollSeeder {

    constructor(
        private readonly _pollRepo: IPollRepository,
    ) { }

    async seedPredefinedPolls(): Promise<void> {
        const count = await this._pollRepo.count();
        if (count === 0) {
            console.log('🌱 Seeding predefined polls...');
            await this._pollRepo.createMany([
                {
                    question: 'Which backend framework do you prefer?',
                    options: [
                        { text: 'Express' },
                        { text: 'NestJS' },
                        { text: 'Fastify' },
                    ] as any,
                    isActive: true,
                },
                {
                    question: 'Which database do you prefer?',
                    options: [
                        { text: 'MongoDB' },
                        { text: 'PostgreSQL' },
                        { text: 'MySQL' },
                    ] as any,
                    isActive: true,
                },
                {
                    question: 'Which frontend framework do you prefer?',
                    options: [
                        { text: 'React' },
                        { text: 'Vue' },
                        { text: 'Svelte' },
                        { text: 'Angular' },
                    ] as any,
                    isActive: true,
                },
            ]);
            console.log('✅ Predefined polls seeded successfully!');
        }
    }
}