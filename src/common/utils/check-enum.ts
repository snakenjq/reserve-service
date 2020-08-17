import { Check } from 'typeorm';
import * as crypto from 'crypto';

export function CheckEnum(
  tableName: string,
  fieldName: string,
  enumValue: any,
) {
  // Hash enum value and put it as part of constraint name so we can
  // force typeorm to generate migration for enum changes.
  const hash = crypto
    .createHash('sha1')
    .update(Object.values(enumValue).join(''))
    .digest('hex');

  return Check(
    // https://til.hashrocket.com/posts/8f87c65a0a-postgresqls-max-identifier-length-is-63-bytes
    `cke_${tableName}_${fieldName}_${hash}`.slice(0, 63),
    `${fieldName} in (${Object.values(enumValue).map(t => `'${t}'`)})`,
  );
}
