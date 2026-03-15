import { SetMetadata } from '@nestjs/common';
import { METADATA_KEY_ROLES } from '../constants/metadata.constants';

export const Roles = (...roles: string[]) =>
  SetMetadata(METADATA_KEY_ROLES, roles);
