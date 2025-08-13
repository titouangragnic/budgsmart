import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validationMiddleware = <T>(
  type: any,
  skipMissingProperties = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(type, req.body);
    
    validate(dto, { skipMissingProperties }).then((errors) => {
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        );
        
        return res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages
        });
      }
      
      req.body = dto;
      next();
    });
  };
};
