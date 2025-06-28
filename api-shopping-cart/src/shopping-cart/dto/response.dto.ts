// src/common/dto/response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = any> {
  @ApiProperty({ example: true })
  isSuccess: boolean;

  @ApiProperty({ example: '' })
  message: string;

  @ApiProperty({ type: Object })
  result: T;
}
