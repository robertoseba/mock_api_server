import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsRestMethod(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsRestMethod',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const invalidMethods = Object.keys(value).filter((key) => {
            return !['POST', 'GET', 'DELETE', 'PATCH'].includes(key);
          });
          return invalidMethods.length > 0 ? false : true;
        },
      },
    });
  };
}
