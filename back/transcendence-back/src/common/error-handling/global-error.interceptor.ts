import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorManager } from './error.manager';

@Injectable()
export class GlobalErrorInterceptor implements NestInterceptor {
    /**
     * Interceptor que se ejecuta tras la llamada al endpoint y gestiona los errores que puedan surgir.
     *
     * @param context - Contexto de la ejecución de la petición, contiene información de la solicitud y del cliente.
     * @param next - Controlador de la llamada, permite pasar la ejecución al siguiente manejador.
     * @returns - Devuelve un flujo de datos observable, que puede ser la respuesta exitosa de la solicitud o un error procesado y manejado.
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            //Ejecuta el interceptor tras la llamada al endpoint
            catchError((error) => {
                //Captura cualquier error que surja
                if (error instanceof ErrorManager) {
                    // Si el error es una instancia de ErrorManager (error gestionado)
                    return throwError(
                        () => error.throwSignatureError(), // Se maneja el error si corresponde a una instancia de ErrorManager
                    );
                }

                return throwError(
                    () =>
                        new HttpException( // Si el error es inesperado (no gestionado por ErrorManager), lanza un error genérico
                            {
                                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                                message: error.message,
                                error: 'Internal Server Error',
                            },
                            HttpStatus.INTERNAL_SERVER_ERROR, // Código de estado HTTP 500
                        ),
                );
            }),
        );
    }
}
