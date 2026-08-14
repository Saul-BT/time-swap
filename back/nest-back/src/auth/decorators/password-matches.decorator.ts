import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class MatchPasswordsConstraint implements ValidatorConstraintInterface {
    validate(repeatPassword: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const password = (args.object as any)[relatedPropertyName];
        return repeatPassword === password;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultMessage(args: ValidationArguments) {
        return 'Passwords do not match';
    }
}

export function MatchPasswords(property: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchPasswordsConstraint,
        });
    };
}
