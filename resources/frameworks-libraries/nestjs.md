---
id: nestjs
title: NestJS
sidebar_label: NestJS
tags: [nodejs, backend, typescript, framework]
---

> A progressive Node.js framework for building efficient, scalable server-side applications, built with and fully supporting TypeScript. Heavily inspired by Angular's architecture (modules, decorators, dependency injection).

## Why NestJS?

- Brings **structure and convention** to Node.js backends (unlike the "bring your own architecture" feel of Express).
- **TypeScript-first**, though plain JavaScript is supported.
- Built on top of **Express** by default (can swap to **Fastify** for better performance).
- Encourages **SOLID principles** through modules, dependency injection, and separation of concerns.
- Great for teams coming from Angular, Spring, or .NET — the mental model (DI, decorators, modules) will feel familiar.

## Core Building Blocks

### 1. Modules

Every Nest app has at least one root module (`AppModule`). Modules organize the app into cohesive blocks of functionality.

```ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],               // other modules this module depends on
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],   // makes UsersService available to modules that import this one
})
export class UsersModule {}
```

**Key idea:** modules are singletons by default — imported once, shared everywhere it's imported (unless registered as scoped, see below).

### 2. Controllers

Handle incoming requests and return responses. Route handling lives here — logic should not.

```ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // prefix: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

### 3. Providers / Services

Where business logic lives. Anything decorated with `@Injectable()` can be injected via Nest's DI container.

```ts
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  create(dto: CreateUserDto) {
    const user = { id: crypto.randomUUID(), ...dto };
    this.users.push(user);
    return user;
  }
}
```

## Dependency Injection (DI)

Nest's DI container resolves providers automatically based on constructor parameter types.

```ts
constructor(private readonly usersService: UsersService) {}
```

- `providers` array in a module tells Nest "this class can be injected."
- `exports` makes a provider available to modules that import this module.
- Custom providers can use `useValue`, `useClass`, `useFactory`, or `useExisting` for more control:

```ts
{
  provide: 'CONFIG_OPTIONS',
  useFactory: () => ({ apiKey: process.env.API_KEY }),
}
```

### Provider Scopes

| Scope | Behavior |
|---|---|
| `DEFAULT` | Singleton, shared across the whole app (default, most performant) |
| `REQUEST` | New instance per incoming request |
| `TRANSIENT` | New instance every time it's injected |

```ts
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}
```

⚠️ Request-scoped providers bubble up — anything injecting them also becomes request-scoped, which can hurt performance if overused.

## DTOs & Validation

DTOs (Data Transfer Objects) define the shape of incoming data. Pair with `class-validator` and `class-transformer` for automatic validation.

```bash
npm install class-validator class-transformer
```

```ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;
}
```

Enable globally in `main.ts`:

```ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // strips properties not in the DTO
  forbidNonWhitelisted: true, // throws if extra properties are sent
  transform: true,        // auto-transforms payloads into DTO instances
}));
```

## Pipes

Transform or validate input data before it hits the route handler.

- Built-in: `ValidationPipe`, `ParseIntPipe`, `ParseUUIDPipe`, `DefaultValuePipe`.
- Can be applied at parameter, handler, controller, or global level.

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

## Guards

Handle **authorization** — decide whether a request should proceed. Run before route handlers.

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.headers.authorization;
  }
}
```

```ts
@UseGuards(AuthGuard)
@Get('profile')
getProfile() { ... }
```

Common real-world pattern: `JwtAuthGuard` + `RolesGuard` combo, with a custom `@Roles()` decorator and metadata via `Reflector`.

## Interceptors

Wrap around request/response handling — great for logging, response transformation, caching, timeout handling. Powered by RxJS.

```ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`Request took ${Date.now() - now}ms`)),
    );
  }
}
```

## Exception Filters

Centralize error handling and shape error responses consistently.

```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
```

## Request Lifecycle (order matters!)

```
Incoming Request
   → Middleware
   → Guards
   → Interceptors (pre-controller)
   → Pipes
   → Route Handler (Controller)
   → Interceptors (post-controller)
   → Exception Filters (if error thrown)
   → Response
```

This ordering trips people up a lot — e.g. Guards run **before** Pipes, so you can't rely on a validated/transformed DTO inside a Guard.

## Middleware

Closer to raw Express middleware — runs before guards, has access to `req`/`res`/`next`. No access to the `ExecutionContext`.

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  }
}
```

Applied in the module via `configure()`:

```ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

## Custom Decorators

Useful for pulling data out of the request cleanly.

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

```ts
@Get('me')
getMe(@CurrentUser() user: User) {
  return user;
}
```

## Database Integration

Most common combos:

- **TypeORM** (`@nestjs/typeorm`) — mature, decorator-based, works well with Nest's DI.
- **Prisma** — great DX and type safety, but integrates as a service rather than natively like TypeORM.
- **Mongoose** (`@nestjs/mongoose`) — for MongoDB.

Example with TypeORM:

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;
}
```

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  ...
})
export class UsersModule {}
```

```ts
constructor(
  @InjectRepository(User)
  private usersRepository: Repository<User>,
) {}
```

## Configuration

Use `@nestjs/config` for environment variables with validation.

```bash
npm install @nestjs/config
```

```ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  validationSchema: Joi.object({
    DATABASE_URL: Joi.string().required(),
    PORT: Joi.number().default(3000),
  }),
});
```

## Testing

Nest ships with Jest by default and a testing utility module for building isolated test modules.

```ts
import { Test } from '@nestjs/testing';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
  });

  it('should create a user', () => {
    const user = service.create({ name: 'Alice', email: 'a@b.com' });
    expect(user).toHaveProperty('id');
  });
});
```

- Unit tests: mock dependencies with `useValue` in the test module's providers.
- e2e tests: use `supertest` against a full compiled Nest app instance (`app.getHttpServer()`).

## Microservices & Other Transports

Nest isn't just HTTP — it has first-class support for:

- **Microservices**: TCP, Redis, NATS, Kafka, RabbitMQ, gRPC (`@nestjs/microservices`).
- **WebSockets**: `@nestjs/websockets` with Gateways (`@WebSocketGateway()`).
- **GraphQL**: `@nestjs/graphql`, supports both code-first (decorators) and schema-first approaches.
- **CRON / scheduled tasks**: `@nestjs/schedule` with `@Cron()`, `@Interval()`, `@Timeout()`.

## CLI Cheatsheet

```bash
# install CLI
npm i -g @nestjs/cli

# new project
nest new project-name

# generate resources (CRUD scaffold w/ controller, service, module, DTOs)
nest g resource users

# generate individual pieces
nest g module orders
nest g controller orders
nest g service orders
nest g guard auth
nest g interceptor logging
nest g pipe validation
nest g filter http-exception
```

## Project Structure (typical)

```
src/
├── main.ts                # entry point, bootstraps the app
├── app.module.ts          # root module
├── common/                 # shared guards, pipes, interceptors, decorators
├── config/                  # configuration module & env validation
└── modules/
    └── users/
        ├── users.module.ts
        ├── users.controller.ts
        ├── users.service.ts
        ├── dto/
        │   ├── create-user.dto.ts
        │   └── update-user.dto.ts
        └── entities/
            └── user.entity.ts
```

## Gotchas / Things I Learned the Hard Way

- **Circular dependencies between modules/services**: use `forwardRef(() => OtherModule)` — but treat frequent circular deps as a sign of a design smell, not just a bug to patch around.
- **Global pipes/guards/interceptors** set in `main.ts` (`app.useGlobalPipes(...)`) won't have DI access to other providers the same way module-level ones do — if you need DI inside a global pipe/guard, register it as a provider in `AppModule` using the `APP_PIPE` / `APP_GUARD` / `APP_INTERCEPTOR` tokens instead:

  ```ts
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
  ]
  ```

- **Request-scoped providers hurt performance** if injected widely — a new instance gets created per request for the whole injection chain.
- **`exports` vs `providers`**: forgetting to `export` a provider from its module is the #1 cause of "Nest can't resolve dependencies" errors when another module tries to use it.
- Default HTTP adapter is **Express**; swap to **Fastify** (`@nestjs/platform-fastify`) for meaningfully better raw throughput, but double check third-party middleware compatibility first.
- `class-transformer`'s `@Exclude()` / `@Expose()` + a global `ClassSerializerInterceptor` is the clean way to strip sensitive fields (like `password`) from responses instead of manually deleting keys.

## Useful Links

- [Official docs](https://docs.nestjs.com)
- [GitHub](https://github.com/nestjs/nest)
- [Awesome Nest (curated resources)](https://github.com/nestjs/awesome-nestjs)
