export interface RejectInterface {
    mail: string; // Correo del usuario registrado que vamos a cancelar
    name: string; // Nombre del usuario (sin apellido)
    verification_token: string; // Token de verificación asignado a su invitación
    status: boolean; // Si ha sido posible borrar o no las entradas en la BD de verification (true o false)
}
