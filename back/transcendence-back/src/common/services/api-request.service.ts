import { Injectable } from '@nestjs/common';
import * as https from 'https';
import { ErrorManager } from '../error-handling/error.manager';
import fetch, { Response } from 'node-fetch';

@Injectable()
export abstract class ApiRequest {
    /**
     * Variables básicas necesarias para las peticiones. Se pueden añadir más
     * en las clases que implementen ApiRequest
     */
    protected url!: string;
    protected token!: string;
    protected agent: https.Agent | undefined = undefined;

    /**
     * Headers usado para las peticiones. Se define el Content-Type por defecto.
     * Se pueden añadir más headers en las clases que extiendan de esta.
     * La autenticación se añade en el método authenticate()
     * @protected
     */
    protected headers: Record<string, string> = {
        'Content-Type': 'application/json',
        accept: 'application/json',
    };

    /**
     * El constructor llama a los dos métodos básicos del servicio, obligando así
     * a implementarlos
     */
    constructor() {
        this.setVars();
        this.authenticate();
        this.setAgents();
    }

    /**
     * Iniciar las variables de la API
     * @protected
     */
    protected abstract setVars(): void;

    protected abstract setAgents(): void;

    /**
     * Función para realizar la autenticación en la API. Una vez autenticado,
     * se añade el token a los headers para su uso en las peticiones.
     * @protected
     */
    protected abstract authenticate(): void;

    /**
     * Realiza una petición GET a la API
     *
     * @param path          Ruta del end-point para el GET
     * @param params        Parametros de la petición, si los hay
     * @param timeout       Por defecto se establece un timeout de 10 segundos, se puede personalizar
     */
    public async get(path: string, params?: any, timeout: number = 10000) {
        try {
            const response = (await Promise.race([
                fetch(this._getUrl(path, params), {
                    method: 'GET',
                    headers: this.headers,
                    agent: this.agent,
                }),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
            ])) as Response;

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return {
                    status: response.status,
                    data: data,
                };
            } else {
                const text = await response.text();
                return {
                    status: response.status,
                    data: text,
                };
            }
        } catch (error: unknown) {
            ErrorManager.normalize(error, 'Error from external API');
        }
    }

    /**
     * Realiza una petición POST a la API
     *
     * @param path          Ruta del end-point para el PATH
     * @param body          Objeto BODY con información para la petición, si lo hay
     * @param timeout       Por defecto se establece un timeout de 10 segundos, se puede personalizar
     */
    public async post(path: string, body?: any, timeout: number = 10000) {
        try {
            const response = (await Promise.race([
                fetch(this._getUrl(path), {
                    method: 'POST',
                    headers: this.headers,
                    body: body ? JSON.stringify(body) : null,
                    agent: this.agent,
                }),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
            ])) as Response;

            // Verificar el código de estado de la respuesta
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return {
                    status: response.status,
                    data: data,
                };
            } else {
                const text = await response.text();
                return {
                    status: response.status,
                    data: text,
                };
            }
        } catch (error: unknown) {
            ErrorManager.normalize(error, 'Error from external API');
        }
    }

    /**
     * Realiza una petición DELETE a la API
     *
     * @param path          Ruta del end-point para el DELETE
     * @param params        Parametros de la petición, si los hay
     * @param timeout       Por defecto se establece un timeout de 10 segundos, se puede personalizar
     */
    public async delete(path: string, params?: any, timeout: number = 10000) {
        try {
            const response = (await Promise.race([
                fetch(this._getUrl(path, params), {
                    method: 'DELETE',
                    headers: this.headers,
                    agent: this.agent,
                }),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
            ])) as Response;

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return {
                    status: response.status,
                    data: data,
                };
            } else {
                const text = await response.text();
                return {
                    status: response.status,
                    data: text,
                };
            }
        } catch (error: unknown) {
            ErrorManager.normalize(error, 'Error from external API');
        }
    }

    /**
     * Realiza una petición PUT a la API
     *
     * @param path          Ruta del end-point para el DELETE
     * @param body          Parametros de la petición, si los hay
     * @param timeout       Por defecto se establece un timeout de 10 segundos, se puede personalizar
     * @returns
     */
    public async put(path: string, body?: any, timeout: number = 10000) {
        try {
            const response = (await Promise.race([
                fetch(this._getUrl(path), {
                    method: 'PUT', // Método PUT
                    headers: this.headers,
                    body: body ? JSON.stringify(body) : null,
                    agent: this.agent, // Usar el agent si está definido
                }),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
            ])) as Response;

            // Verificar el código de estado de la respuesta
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return {
                    status: response.status,
                    data: data,
                };
            } else {
                const text = await response.text();
                return {
                    status: response.status,
                    data: text,
                };
            }
        } catch (error: unknown) {
            ErrorManager.normalize(error, 'Error from external API');
        }
    }

    /**
     * Devuelve la URL completa tras añadir el path y los parámetros GET en caso de que existan
     * @param path
     * @param getParams
     * @private
     */
    private _getUrl(path: string, getParams?: any) {
        // Se elimina la barra final de la url de la API
        const url: string = this.url.endsWith('/') ? this.url.slice(0, -1) : this.url;

        // Se elimina la barra del principio del path, si existe
        path = path.startsWith('/') ? path.slice(1) : path;

        // Se añaden los parámetros GET al path en caso de que existan
        if (getParams) {
            const params: URLSearchParams = new URLSearchParams(getParams);
            path += `?${params.toString()}`;
        }

        return `${url}/${path}`;
    }
}
