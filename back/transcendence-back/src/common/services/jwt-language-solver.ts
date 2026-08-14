/*import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nResolver } from 'nestjs-i18n';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Injectable()
export class JwtLanguageResolver implements I18nResolver {
    constructor(private readonly jwtService: JwtService) {}

    public resolve(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const token = AuthGuard.extractTokenFromHeader(request);

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            const userJWTLanguage = payload?.language;
            return userJWTLanguage;
        } catch (error) {}
    }
}*/
