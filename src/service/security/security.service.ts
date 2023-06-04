import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityService {
  async plainTextEncrypt(text: string) {
    return await bcrypt.hash(text, 10);
  }

  async compareTextHasg(text: string, hash: string) {
    return await bcrypt.compare(text, hash);
  }
}
