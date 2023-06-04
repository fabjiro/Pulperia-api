import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';
import { Image } from './image/entities/image.entity';
import { DropboxService } from './service/dropbox/dropbox.service';
import { SecurityService } from './service/security/security.service';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from './service/security/security.module';

const ENV = process.env.NODE_ENV;
console.log(ENV);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT) || 5432,
      username: process.env.PG_USERNAME || 'postgres',
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASENAME,
      entities: [Image],
      synchronize: true,
    }),
    ImageModule,
    SecurityModule,
  ],
  controllers: [AppController],
  providers: [AppService, DropboxService, SecurityService],
})
export class AppModule {}
