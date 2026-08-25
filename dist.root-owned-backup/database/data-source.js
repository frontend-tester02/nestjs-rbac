"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const snake_naming_strategy_1 = require("./snake-naming.strategy");
(0, dotenv_1.config)({ path: ['.env'] });
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'nestjs_rbac',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    namingStrategy: new snake_naming_strategy_1.SnakeNamingStrategy(),
    logging: process.env.DB_LOGGING === 'true',
});
//# sourceMappingURL=data-source.js.map