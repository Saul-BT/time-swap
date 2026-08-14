import { Role } from 'src/common/enums/role.enum';

export interface AllUsersOutput {
    user: {
        mail: string;
        role: Role;
        avatarUrl: string;
    }[];
}
