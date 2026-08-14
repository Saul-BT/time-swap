import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

function checkEquals(configA: Record<string, unknown>, configB: Record<string, unknown>, key: string) {
    if (!configA[key] || !configB[key]) return false;
    if (configA[key] !== configB[key]) return false;

    return true;
}

export function validateEnv(config: Record<string, unknown>) {
    // Conseguir todas las variables del .env.example
    const absolutePath = path.resolve('./.env.example');
    const envExample = fs.readFileSync(absolutePath, 'utf8');
    const envParsed = dotenv.parse(envExample);

    // Comprueba que existan ENV_VERSION y ENV_DATE y coincidan con el env
    const propToCheck = ['ENV_VERSION', 'ENV_DATE'];
    for (const key of propToCheck) {
        if (!checkEquals(envParsed, config, key)) {
            throw new Error(`.env key ${key} does not match .env.example`);
        }
    }

    const expectedKeys = Object.keys(envParsed);
    const configKeys = Object.keys(config);

    // Comprueba que todas las propiedades del .env.example existan en nuestro env
    const notFoundProperties = expectedKeys.filter((key) => !configKeys.includes(key));
    if (notFoundProperties.length > 0) {
        throw new Error(`Found not defined properties in env configuration: ${notFoundProperties.join(', ')}`);
    }

    // Comprueba que no existan propiedades sin definir en el .env.example
    const extraProperties = configKeys.filter((key) => !expectedKeys.includes(key));
    if (extraProperties.length > 0) {
        throw new Error(`Unexpected properties found in env configuration: ${extraProperties.join(', ')}`);
    }

    // Transforma valores 'true' y 'false' a boolean
    for (const key of configKeys) {
        if (config[key] === 'true') {
            config[key] = true;
        } else if (config[key] === 'false') {
            config[key] = false;
        }
    }

    return config;
}
