export enum Language {
    EN = 'en',
    ES = 'es',
}

/**
 * Método estatico para devolver el idioma en formato ENUM al extraerlo de las cabeceras al
 * usar los end-point desde front
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Language {
    export function fromHeader(acceptLanguage: string): Language {
        const languages = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim());
        for (const lang of languages) {
            if (lang.startsWith('es')) {
                return Language.ES;
            }
        }
        return Language.EN;
    }
}
