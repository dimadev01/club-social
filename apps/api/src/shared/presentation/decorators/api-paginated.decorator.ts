import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginatedDataResponseDto } from '../dto/paginated-response.dto';

export const ApiPaginatedResponse = (model: Type<unknown>) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDataResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDataResponseDto) },
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
