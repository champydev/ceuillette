import { Injectable } from '@angular/core';
import * as crypto from "crypto-js";



@Injectable()
export class CryptoService {
  constructor() { }

  hashPassword(password: string): string {
    let hash: string = crypto.SHA256(password).toString();
    hash = crypto.SHA3('salt' + hash).toString();
    hash = crypto.SHA512(hash + 'pepper').toString();
    hash = crypto.SHA256(hash).toString();
    return hash;
  }

}
