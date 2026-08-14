import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { Verification } from '../../auth/entities/verification.entity';
import { AuthService } from '../../auth/services/auth.service';
import { ErrorManager } from '../../common/error-handling/error.manager';
import { UserActiveInterface } from '../../common/interfaces/user-active.interface';
import MailService from '../../mail/mail.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-pass.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { TemporalOtp } from '../entities/temporal-2fa.entity';
import { Role, User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { Language } from '../enums/language.enum';

// Inicio de variables para el .env (necesita mock)
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

describe('UserService', () => {
    // Mock de variables en .env
    process.env.JWT_EXPIRATION = '999m';

    // Declaracion de servicios y entidades
    let module: TestingModule;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let authService: AuthService;
    let userService: UserService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let jwtService: JwtService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let otpRepository: Repository<TemporalOtp>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mailService: MailService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mailerService: MailerService;

    /**
     * Mock de usuario que se usara para las pruebas. En caso de añadir nuevos
     * valores al usuario, iniciar aquí dichos valores y revisar en que pruebas
     * unitarias se comparan.
     */
    const mockUser = new User();
    mockUser.id = 1;
    mockUser.mail = 'test@test.com';
    mockUser.name = 'Test User';
    mockUser.password = 'password';
    mockUser.role = Role.USER;
    mockUser.createdAt = new Date();
    mockUser.updatedAt = new Date();
    mockUser.deletedAt = null;

    /**
     * Mock del repositorio de usuarios y sus métodos CRUD
     */
    const mockUserRepository = {
        find: jest.fn().mockResolvedValue([mockUser]),
        findOne: jest.fn().mockResolvedValue(mockUser),
        findOneBy: jest.fn().mockImplementation((conditions) => {
            if (conditions.mail === 'test@test.com') {
                return Promise.resolve(mockUser);
            }
            return Promise.resolve(null);
        }),
        save: jest.fn().mockImplementation((user) => {
            // Return the user with the provided data
            return Promise.resolve({
                ...user,
                id: 2, // Assign a new ID to the new user
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            });
        }),
        delete: jest.fn().mockImplementation((conditions) => {
            if (conditions.mail === 'test@test.com') {
                return Promise.resolve({ affected: 1 });
            }
            return Promise.resolve({ affected: 0 });
        }),
    };

    /**
     * Mock del servicio de Open Search y sus métodos
     */
    const mockOpensearchClient = {
        search: jest.fn().mockResolvedValue({
            body: {
                hits: {
                    total: { value: 1 },
                    hits: [
                        {
                            _source: {
                                section: {
                                    files: [],
                                },
                            },
                        },
                    ],
                },
            },
        }),
        index: jest.fn().mockResolvedValue({}),
        indices: {
            delete: jest.fn().mockResolvedValue({ acknowledged: true }),
        },
    };

    /**
     * Antes de iniciar las pruebas, se debe ejecutar un beforeAll donde
     * realizar el mock del module.
     */
    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                UserService,
                AuthService,
                JwtService,
                MailService,
                {
                    provide: MailerService,
                    useValue: {
                        sendMail: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Verification),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(TemporalOtp),
                    useValue: {
                        save: jest.fn(),
                        create: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();
        authService = module.get<AuthService>(AuthService);
        mailService = module.get<MailService>(MailService);
        mailerService = module.get<MailerService>(MailerService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        otpRepository = module.get<Repository<TemporalOtp>>(getRepositoryToken(TemporalOtp));
    });

    /**
     * Después de cada test, se limpian los mock de esos test.
     */
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    /**
     * Pruebas unitarias de Creación de usuario
     */
    describe('createUser', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                mail: 'newuser@test.com',
                name: 'New User',
                password: 'NewPassword_01',
                role: Role.USER,
            };

            const result = await userService.createUser(createUserDto);
            expect(result).toEqual(
                expect.objectContaining({
                    mail: createUserDto.mail,
                    name: createUserDto.name,
                    role: createUserDto.role,
                }),
            );
        });

        it('should throw an error if the email is duplicated', async () => {
            const createUserDto: CreateUserDto = {
                mail: 'test@test.com',
                name: 'Test User',
                password: 'password',
                role: Role.USER,
            };

            await expect(userService.createUser(createUserDto)).rejects.toThrow(ErrorManager);
        });
    });

    /**
     * Pruebas unitarias de Borrado de usuario
     */
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const result = await userService.deleteUser('test@test.com');
            expect(result).toEqual({ affected: 1 });
        });

        it('should throw an error if the user is not found', async () => {
            (mockUserRepository.findOneBy as jest.Mock).mockResolvedValueOnce(null);
            await expect(userService.deleteUser('nonexistent@test.com')).rejects.toThrow(ErrorManager);
        });

        it('should throw an error if the user is a SUPER_ADMIN', async () => {
            (mockUserRepository.findOneBy as jest.Mock).mockResolvedValueOnce({
                ...mockUser,
                role: Role.SUPER_ADMIN,
            });
            await expect(userService.deleteUser('test@test.com')).rejects.toThrow(ErrorManager);
        });
    });

    /**
     * Pruebas unitarias de Búsqueda (todos)
     */
    describe('findAll', () => {
        it('should return all users', async () => {
            const result = await userService.findAll();
            expect(result).toEqual({ user: [mockUser] });
        });
    });

    /**
     * Pruebas unitarias de Búsqueda (por email)
     */
    describe('findByMail', () => {
        it('should return a user by email', async () => {
            const result = await userService.findByMail('test@test.com');
            expect(result).toEqual(expect.objectContaining({ mail: 'test@test.com' }));
        });

        it('should return null if the user is not found', async () => {
            (mockUserRepository.findOneBy as jest.Mock).mockResolvedValueOnce(null);
            const result = await userService.findByMail('nonexistent@test.com');
            expect(result).toBeNull();
        });
    });

    /**
     * Pruebas unitarias de Actualización de usuario
     */
    describe('updateUser', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = {
                mail: 'updated@test.com',
                name: 'Updated User',
                role: Role.ADMIN,
                twoFactorCode: true,
            };

            const userActive: UserActiveInterface = {
                id: mockUser.id,
                name: 'Nombre',
                //twoFactorCode: false,
                mail: mockUser.mail,
                role: mockUser.role,
                validated: true,
                language: Language.EN,
                //companies: 0,
            };

            const result = await userService.updateUser(userActive, updateUserDto);
            expect(result).toEqual(expect.objectContaining({ mail: updateUserDto.mail }));
        });

        it('should throw an error if the user is not found', async () => {
            (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce(null);
            const updateUserDto: UpdateUserDto = {
                mail: 'updated@test.com',
                name: 'Updated User',
                role: Role.ADMIN,
                twoFactorCode: true,
            };

            const userActive: UserActiveInterface = {
                id: mockUser.id,
                name: 'Nombre',
                //twoFactorCode: false,
                mail: mockUser.mail,
                role: mockUser.role,
                validated: true,
                language: Language.EN,
                //companies: 0,
            };

            await expect(userService.updateUser(userActive, updateUserDto)).rejects.toThrow(ErrorManager);
        });
    });

    /**
     * Pruebas unitarias de Actualización de contraseña
     */
    describe('updatePassword', () => {
        it('should update the password', async () => {
            const updatePasswordDto: UpdatePasswordDto = {
                oldPassword: 'password',
                newPassword: 'newpassword',
            };

            // Mock the save method to return only the expected fields
            (mockUserRepository.save as jest.Mock).mockResolvedValueOnce({
                mail: 'test@test.com',
            });

            const result = await userService.updatePassword('test@test.com', updatePasswordDto);
            expect(result).toEqual(expect.objectContaining({ mail: 'test@test.com' }));
        });

        it('should throw an error if the old password is incorrect', async () => {
            const updatePasswordDto: UpdatePasswordDto = {
                oldPassword: 'wrongpassword',
                newPassword: 'newpassword',
            };

            await expect(userService.updatePassword('test@test.com', updatePasswordDto)).rejects.toThrow(ErrorManager);
        });
    });
});
