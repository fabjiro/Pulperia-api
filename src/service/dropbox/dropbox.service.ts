import { Injectable, Scope } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { createReadStream } from 'fs';
import { basename, extname } from 'path';

@Injectable({ scope: Scope.DEFAULT })
export class DropboxService {
  private readonly dbx: Dropbox;
  constructor() {
    this.dbx = new Dropbox({ accessToken: process.env.DB_TOKEN });
  }

  async Upload(pathLocal: string, pathCloud: string) {
    const response = await this.dbx.filesUpload({
      path: pathCloud,
      contents: createReadStream(pathLocal),
    });
    return {
      name: basename(pathLocal, extname(pathLocal)),
      path: response['result']['path_display'],
      link: await this.sharedlink(pathCloud),
    };
  }

  async sharedlink(pathCloud: string) {
    const response = await this.dbx.sharingCreateSharedLink({
      path: pathCloud,
    });
    response['result']['url'] = response['result']['url'].replace(
      'https://www.dropbox.com/',
      'https://dl.dropboxusercontent.com/',
    );

    return response['result']['url'];
  }

  async Delete(pathCloud: string) {
    try {
      await this.dbx.filesDeleteV2({
        path: pathCloud,
      });
    } catch (error) {
      return false;
    }
    return true;
  }

  async Move(from: string, to: string) {
    try {
      await this.dbx.filesMoveV2({
        from_path: from,
        to_path: to,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  async CreateFolder(path: string) {
    await this.dbx.filesCreateFolderV2({
      path: path,
      autorename: true,
    });
  }
}
