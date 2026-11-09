import { IntersectionType, PartialType } from "@nestjs/swagger";
import { UserLanguageDto, UserMailDto, UserNameDto, UserNicknameDto, UserPasswordDto, UserPostalCodeDto, UserRoleDto } from "./components.dto";

export class CreateUserDto extends IntersectionType(
    UserMailDto,
    UserNameDto,
    UserNicknameDto,
    UserPasswordDto,
    PartialType(UserRoleDto),
    PartialType(UserLanguageDto),
    PartialType(UserPostalCodeDto)
) {}
