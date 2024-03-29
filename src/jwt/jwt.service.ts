import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  // use this one if you want to use this module in other projects
  // sign(payload: object): string {
  //   return jwt.sign(payload, this.options.privateKey);
  // }
  sign(userID: number): string {
    return jwt.sign({ id: userID }, this.options.privateKey);
  }

  verify(token: string){
    return jwt.verify(token, this.options.privateKey);
  }
}
