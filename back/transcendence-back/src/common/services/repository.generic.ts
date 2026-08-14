import { Repository, FindManyOptions, DeepPartial, EntityTarget, EntityManager, QueryRunner, ObjectLiteral } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ErrorManager } from '../error-handling/error.manager';
import { PaginatedResponse } from '../dtos/paginated.dto';
//import { I18nService } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class CrudRepository<T extends ObjectLiteral> extends Repository<T> {
    constructor(
        target: EntityTarget<T>,
        manager: EntityManager,
        queryRunner: QueryRunner | undefined,
        //private readonly i18n: I18nService<I18nTranslations>,
    ) {
        super(target, manager, queryRunner); // Obligatorio extiendes Repository
    }
    /**
     * Nombre de la entidad, se puede sobreescribir en la subclase.
     */

    entityName: string = 'Entity';

    /**
     * Obtiene todos los registros de forma paginada.
     *
     * @param page Página actual (por defecto 1).
     * @param limit Cantidad de registros por página (por defecto 10).
     * @param options Opciones adicionales de búsqueda.
     * @returns Objeto con los datos, total de registros, página y límite.
     */
    async findAllPaginated(
        page: number = 1,
        limit: number = 10,
        options?: FindManyOptions<T>,
    ): Promise<PaginatedResponse<T>> {
        const skip = (page - 1) * limit;
        const [list, total] = await this.findAndCount({
            skip,
            take: limit,
            ...options,
        });
        return { list, total, page, pageSize: limit, totalPages: Math.floor(total / limit) };
    }

    /**
     * Obtiene un registro por su identificador.
     *
     * @param id Identificador del registro.
     * @param options Opciones adicionales de búsqueda.
     * @returns Registro encontrado o null si no existe.
     */
    async findOneById(id: number | string, options?: FindManyOptions<T>): Promise<T> {
        const entity = await this.findOne({
            where: { id } as any,
            ...options,
        });
        if (!entity) {
            throw new ErrorManager(
                'NOT_FOUND',
                'NOT FOUND'
            );
        }
        return entity;
    }

    async createEntity(data: DeepPartial<T>): Promise<T> {
        const id = (data as any).id;
        if (id !== undefined && id !== null) {
            const existing = await this.findOneById(id);
            if (existing) {
                throw new ErrorManager(
                    'CONFLICT',
                    'ALREADY EXISTS');
            }
        }
        const entity = this.create(data);
        return this.save(entity);
    }
    /**
     * Actualiza un registro existente.
     *
     * @param id Identificador del registro a actualizar.
     * @param data Datos nuevos.
     * @returns Registro actualizado.
     */
    async updateEntity<U = T>(
        id: number | string,
        data: DeepPartial<T>,
        transform?: (entity: T) => U,
    ): Promise<U | null> {
        if (await this.notFoundEntity(id)) {
            throw new ErrorManager(
                'NOT_FOUND',
                'NOT FOUND');
        }
        await this.update(id, data as QueryDeepPartialEntity<T>);
        const updatedEntity = await this.findOneById(id);
        return updatedEntity ? (transform ? transform(updatedEntity) : (updatedEntity as unknown as U)) : null;
    }

    /**
     * Elimina un registro por su identificador.
     *
     * @param id Identificador del registro a eliminar.
     * @returns true si se eliminó correctamente, de lo contrario false.
     */
    async deleteEntity(id: number | string): Promise<boolean> {
        if (await this.notFoundEntity(id)) {
            throw new ErrorManager(
                'NOT_FOUND',
                'NOT FOUND'
            );
        }
        const result = await this.delete(id);
        return !!result.affected && result.affected > 0;
    }

    /**
     * Verifica si no se encontró la entidad.
     *
     * @param id Identificador del registro.
     * @returns true si no existe, false si existe.
     */
    async notFoundEntity(id: number | string): Promise<boolean> {
        const entity = await this.findOneById(id);
        return entity === null;
    }
}
