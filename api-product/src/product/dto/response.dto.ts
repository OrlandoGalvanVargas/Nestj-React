// product/dto/response.dto.ts

export class ResponseDto<T = any> {
  result: T;
  isSuccess: boolean = true;
  message: string = '';
}
