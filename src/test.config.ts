import { AppConfig } from './app/app.config';

export const testAppConfig: AppConfig = {
  host: 'localhost',
  port: 4200,
  baseHref: '/',
  brokerUrl: 'ws://localhost:9000',
  serviceUrl: 'http://localhost:9000',
  uiUrl: 'http://localhost:4200',
  embedUrl: 'http://localhost:4201',
  vivoUrl: 'http://localhost:8080/vivo',
  vivoEditorUrl: 'http://localhost:8080/vivo_editor',
  collectSearchStats: false
};
