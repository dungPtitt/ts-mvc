import { IsNotEmpty, IsString } from "class-validator"

export class CreateFileDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  filename: string

  @IsNotEmpty()
  @IsString()
  filepath: string

  @IsNotEmpty()
  @IsString()
  filetype: string
}

export class UpdateFileDTO {
  id?: number

  @IsNotEmpty()
  @IsString()
  filename: string

  @IsNotEmpty()
  @IsString()
  filepath: string

  @IsNotEmpty()
  @IsString()
  filetype: string
}