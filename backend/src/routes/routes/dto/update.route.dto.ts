/**
 * @file DTO specification for updating a route.
 */
import { CreateRoutePublic } from './create.route.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateRoute extends PartialType(CreateRoutePublic) {}
