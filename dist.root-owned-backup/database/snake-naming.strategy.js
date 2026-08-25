"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnakeNamingStrategy = void 0;
const typeorm_1 = require("typeorm");
const StringUtils_1 = require("typeorm/util/StringUtils");
class SnakeNamingStrategy extends typeorm_1.DefaultNamingStrategy {
    tableName(className, customName) {
        return customName || (0, StringUtils_1.snakeCase)(className);
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return ((0, StringUtils_1.snakeCase)(embeddedPrefixes.join('_')) +
            (customName || (0, StringUtils_1.snakeCase)(propertyName)));
    }
    relationName(propertyName) {
        return (0, StringUtils_1.snakeCase)(propertyName);
    }
    joinColumnName(relationName, referencedColumnName) {
        return (0, StringUtils_1.snakeCase)(`${relationName}_${referencedColumnName}`);
    }
    joinTableName(firstTableName, secondTableName, firstPropertyName) {
        return (0, StringUtils_1.snakeCase)(`${firstTableName}_${secondTableName}`);
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return (0, StringUtils_1.snakeCase)(`${tableName}_${columnName ?? propertyName}`);
    }
}
exports.SnakeNamingStrategy = SnakeNamingStrategy;
//# sourceMappingURL=snake-naming.strategy.js.map