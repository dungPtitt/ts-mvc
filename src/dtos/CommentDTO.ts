import { IsString, Length, IsOptional, IsNumber } from "class-validator"

export class CreateCommentDto {
  id?: number

  @IsString()
  content: string
  @IsNumber()
  blogPostId: number
}

export class UpdateCommentDto {
  id?: number

  @IsOptional()
  @IsString()
  content?: string
  status?: string
}
