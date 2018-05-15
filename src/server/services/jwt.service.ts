import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as nodeRsa from 'node-rsa';
export class JwtService {
  private static rsaPrivateKeyFile = 'jwt.private.key';
  private static rsaPublicKeyFile = 'jwt.public.key';
  private static rsaPrivateKey = '';
  private static rsaPublicKey = '';
  public static async validateToken(token: string): Promise<Object> {
    const key = await JwtService.rsaPublicKey;
    return new Promise<Object | Error>((resolve, reject) => {
      jwt.verify(token, key, { algorithms: ['RS256'] }, function(err, decoded) {
        if (err != null) {
          resolve(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  public static async generateToken(userId: string): Promise<string> {
    await JwtService.generateKeyPairIfNotExist();
    await JwtService.loadKeyPair();
    const payload = {
      userId: userId,
      date: new Date()
    };
    const token = await jwt.sign(payload, JwtService.rsaPrivateKey, {
      algorithm: 'RS256',
      expiresIn: '1h'
    });
    return token;
  }
  private static async fileExists(filePath: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.exists(filePath, (exists: boolean) => {
        resolve(exists);
      });
    });
  }
  private static async deleteFile(filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(filePath, err => {
        if (err != null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private static async writeFile(
    filePath: string,
    content: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, content, err => {
        if (err != null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  private static async readFile(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(data.toString());
        }
      });
    });
  }
  private static async loadKeyPair(): Promise<void> {
    JwtService.rsaPrivateKey = await JwtService.readFile(
      JwtService.rsaPrivateKeyFile
    );
    JwtService.rsaPublicKey = await JwtService.readFile(
      JwtService.rsaPublicKeyFile
    );
  }
  private static async generateKeyPairIfNotExist(): Promise<void> {
    const privateKeyFileExist = await JwtService.fileExists(
      JwtService.rsaPrivateKeyFile
    );
    const publicKeyFileExist = await JwtService.fileExists(
      JwtService.rsaPublicKeyFile
    );

    if (privateKeyFileExist && publicKeyFileExist) return;

    if (privateKeyFileExist) {
      await JwtService.deleteFile(JwtService.rsaPrivateKeyFile);
    }
    if (publicKeyFileExist) {
      await JwtService.deleteFile(JwtService.rsaPublicKeyFile);
    }
    const key = new nodeRsa({ b: 512 });
    key.generateKeyPair();
    const privateKey = key.exportKey('pkcs1-private-pem');
    const publicKey = key.exportKey('pkcs1-public-pem');
    await JwtService.writeFile(JwtService.rsaPrivateKeyFile, privateKey);
    await JwtService.writeFile(JwtService.rsaPublicKeyFile, publicKey);
  }
}
