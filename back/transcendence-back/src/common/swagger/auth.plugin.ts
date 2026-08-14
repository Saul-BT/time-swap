import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from '../interfaces/user-active.interface';

interface ImmutableMapLike {
    get<T = unknown>(key: string): T;
}

interface ImmutableListLike<T extends ImmutableMapLike = ImmutableMapLike> {
    toArray(): T[];
    forEach(callback: (value: T, key: string) => void): void;
}

interface ImmutableMapCollection<T extends ImmutableMapLike = ImmutableMapLike> extends ImmutableListLike<T> {
    get(key: string): T;
}

interface ReactLike {
    createElement: (...args: unknown[]) => unknown;
    useState<T>(initial: T): [T, (value: T | ((previous: T) => T)) => void];
}

type SwaggerComponent = (props: Record<string, unknown>) => unknown;

interface SwaggerSystem {
    specSelectors: {
        customTokens(): ImmutableListLike | undefined;
        securityDefinitions(): ImmutableMapCollection;
    };
    authSelectors: {
        authorized(): ImmutableMapCollection;
    };
    authActions: {
        configureAuth(auth: Record<string, { value: string; schema: unknown }>): void;
        authorizeWithPersistOption(auth: Record<string, { value: string; schema: unknown }>): void;
    };
    React: ReactLike;
}

type TokenInfo = {
    name: string;
    token: string;
};

type DecodedTokenPayload = Record<string, unknown> & {
    exp?: number;
    iat?: number;
    isExpired?: boolean;
    expiresIn?: number;
    issuedAt?: string;
};

export const AuthPlugin = {
    statePlugins: {
        spec: {
            selectors: {
                customTokens: (state: ImmutableMapLike) => {
                    const spec = state.get<ImmutableMapLike | undefined>('json');
                    if (!spec) {
                        return undefined;
                    }
                    return spec.get<ImmutableListLike | undefined>('x-custom-tokens');
                },
            },
        },
    },
    wrapComponents: {
        authorizeBtn: (Original: SwaggerComponent, system: SwaggerSystem) => (props: Record<string, unknown>) => {
            const decodeJWT = (token: string): DecodedTokenPayload | null => {
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) return null;

                    const base64Url = parts[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(window.atob(base64)) as DecodedTokenPayload;

                    const currentTime = Math.floor(Date.now() / 1000);

                    if (typeof payload.exp === 'number') {
                        payload.isExpired = payload.exp < currentTime;
                        payload.expiresIn = payload.isExpired ? 0 : payload.exp - currentTime;
                    }

                    if (typeof payload.iat === 'number') {
                        payload.issuedAt = new Date(payload.iat * 1000).toISOString();
                    }

                    return payload;
                } catch (error) {
                    console.error('Error decoding JWT:', error);
                    return null;
                }
            };

            const tokensCollection = system.specSelectors.customTokens();
            const tokensArray = tokensCollection?.toArray?.() ?? [];
            const tokensParsed = tokensArray.reduce<TokenInfo[]>((acc, tokenMap) => {
                const name = tokenMap.get<string>('name');
                const tokenValue = tokenMap.get<string>('token');

                if (typeof name === 'string' && typeof tokenValue === 'string') {
                    acc.push({ name, token: tokenValue });
                }

                return acc;
            }, []);

            const authorizedDefinitions = system.authSelectors.authorized();
            let currentToken: string | null = null;
            authorizedDefinitions.forEach((definition: ImmutableMapLike, key: string) => {
                if (key === 'bearer') {
                    const value = definition.get<string>('value');
                    if (typeof value === 'string') {
                        currentToken = value;
                    }
                }
            });

            const decodedToken = currentToken ? decodeJWT(currentToken) : null;

            const buildAuthPayload = (
                tokenValue: string,
            ): Record<string, { value: string; schema: unknown }> | null => {
                const definitions = system.specSelectors.securityDefinitions();
                let bearerAuthKey: string | null = null;

                definitions.forEach((definition: ImmutableMapLike, key: string) => {
                    const type = definition.get<string>('type');
                    const scheme = definition.get<string>('scheme');
                    if (type === 'http' && typeof scheme === 'string' && scheme.toLowerCase() === 'bearer') {
                        bearerAuthKey = key;
                    }
                });

                if (!bearerAuthKey) {
                    console.error('No bearer auth scheme found in spec');
                    return null;
                }

                const schema = definitions.get(bearerAuthKey);

                return {
                    [bearerAuthKey]: {
                        value: tokenValue,
                        schema,
                    },
                };
            };

            const elements = tokensParsed.map((tokenInfo) => {
                const isCurrentToken = currentToken === tokenInfo.token;
                if (isCurrentToken && decodedToken) {
                    console.log('Custom token selected:', decodedToken);
                }

                return system.React.createElement(
                    'button',
                    {
                        className: isCurrentToken ? 'btn authorize' : 'btn',
                        style: { marginRight: '10px', marginBottom: '10px' },
                        onClick: () => {
                            const authPayload = buildAuthPayload(tokenInfo.token);
                            if (!authPayload) {
                                return;
                            }

                            system.authActions.configureAuth(authPayload);
                            system.authActions.authorizeWithPersistOption(authPayload);
                        },
                    },
                    tokenInfo.name,
                );
            });

            const [isUserButtonsVisible, setUserButtonsVisible] = system.React.useState<boolean>(true);

            const toggleButton = system.React.createElement(
                'button',
                {
                    className: 'btn',
                    style: { cursor: 'pointer' },
                    onClick: () => setUserButtonsVisible((previous) => !previous),
                },
                isUserButtonsVisible ? '^' : 'v',
            );

            const buttonsWrapper = isUserButtonsVisible
                ? system.React.createElement(
                      'div',
                      {
                          style: {
                              marginTop: '5px',
                              display: 'block',
                          },
                      },
                      elements,
                  )
                : null;

            const userButtonsContainer = system.React.createElement(
                'div',
                { style: { marginBottom: '1em' } },
                toggleButton,
                buttonsWrapper,
            );

            const excludedKeys = new Set(['iat', 'exp', 'expiresIn', 'isExpired', 'issuedAt']);
            const parsedToken = decodedToken
                ? Object.entries(decodedToken)
                      .filter(([key]) => !excludedKeys.has(key))
                      .map(([key, value]) => `${key}:${String(value)}`)
                      .join(', ')
                : '';

            const parsedTokenElement = decodedToken
                ? system.React.createElement(
                      'div',
                      {
                          style: { padding: '5px' },
                          className: decodedToken.isExpired
                              ? 'swagger-ui opblock opblock-delete opblock-summary'
                              : 'swagger-ui opblock opblock-post opblock-summary',
                      },
                      parsedToken,
                  )
                : null;

            const infoExp = `Expiration time: ${decodedToken?.expiresIn ?? 'N/A'}, isExpired: ${decodedToken?.isExpired ?? 'N/A'}, issuedAt: ${decodedToken?.issuedAt ?? 'N/A'}`;

            const tokenExpirationCont = system.React.createElement(
                'div',
                { style: { padding: '5px' }, className: '' },
                infoExp,
            );

            const uiElements = [
                system.React.createElement(
                    'div',
                    { style: { marginBottom: '1em' } },
                    system.React.createElement(Original as SwaggerComponent, props),
                ),
                userButtonsContainer,
                ...(parsedTokenElement ? [parsedTokenElement] : []),
                tokenExpirationCont,
            ];

            return system.React.createElement('div', { style: { width: '100%' } }, ...uiElements);
        },
    },
};

export function buildAuthTokensSwagger(
    jwtService: JwtService,
    jwtSecret: string,
    usersInfo: UserActiveInterface[],
): Array<{ name: string; token: string }> {
    const customTokens = usersInfo.map((user) => {
        const token = {
            name: user.name,
            token: jwtService.sign(user, { secret: jwtSecret }),
        };
        return token;
    });
    return customTokens;
}
