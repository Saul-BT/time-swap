import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { CrudRepository } from 'src/common/services/repository.generic';

export function createCrudRepositoryProvider<T extends ObjectLiteral>(entity: EntityTarget<T>, providerToken: string, entityName: string) {
    return {
        provide: providerToken,
        useFactory: (dataSource: DataSource): CrudRepository<T> => {
            const baseRepository = dataSource.getRepository(entity);
            Object.setPrototypeOf(baseRepository, CrudRepository.prototype);
            (baseRepository as CrudRepository<T>).entityName = entityName;
            return baseRepository as CrudRepository<T>;
        },
        inject: [DataSource],
    };
}
