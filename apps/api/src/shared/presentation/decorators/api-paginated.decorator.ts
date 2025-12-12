import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginatedDto } from '../dto/paginated.dto';

export const ApiPaginatedResponse = (model: Type<unknown>) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                items: { $ref: getSchemaPath(model) },
                type: 'array',
              },
            },
          },
        ],
        title: `PaginatedResponseOf${model.name}`,
      },
    }),
  );
};
