import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class LangExampleService {
    constructor(private readonly i18n: I18nService<I18nTranslations>) {}

    async getSimpleMessageByLang() {
        return { message: this.i18n.t('example.SIMPLE') };
    }

    async getSimpleMessageByUser() {
        return { message: this.i18n.t('example.SIMPLE') };
    }

    async getAllMessagesByLang() {
        return {
            messages: {
                SIMPLE: this.i18n.t('example.SIMPLE'),
                VARIABLE: this.i18n.t('example.VARIABLE', {
                    args: { variable: 'example' },
                }),
                ARRAY: this.i18n.t('example.ARRAY'),
                COMPLEX: this.i18n.t('example.COMPLEX', {
                    args: { variable1: 'example1', variable2: 'example2' },
                }),
                NESTED: this.i18n.t('example.NESTED'),
            },
        };
    }

    async getAllMessagesByUser() {
        return {
            messages: {
                SIMPLE: this.i18n.t('example.SIMPLE'),
                VARIABLE: this.i18n.t('example.VARIABLE', {
                    args: { variable: 'example' },
                }),
                ARRAY: this.i18n.t('example.ARRAY'),
                COMPLEX: this.i18n.t('example.COMPLEX', {
                    args: { variable1: 'example1', variable2: 'example2' },
                }),
                NESTED: this.i18n.t('example.NESTED'),
            },
        };
    }

    async getVariableMessageByLang(variable: string) {
        return {
            message: this.i18n.t('example.VARIABLE', {
                args: { variable: variable },
            }),
        };
    }

    async getArrayMessageByLang() {
        return { message: this.i18n.t('example.ARRAY') };
    }

    async getNestedMessageByLang() {
        return { message: this.i18n.t('example.NESTED') };
    }

    async getComplexMessageByLang(variable1: string, variable2: string) {
        return {
            message: this.i18n.t('example.COMPLEX', {
                args: { variable1: variable1, variable2: variable2 },
            }),
        };
    }

    async getArrayPositionByLang(position: number) {
        const array = this.i18n.t('example.ARRAY');
        return { message: array[position] };
    }
}
