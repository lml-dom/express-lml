import { Application } from 'express';
import { readFile } from 'fs';
import { OutputConfig, ParseConfig, parseLML } from 'lml';

export interface Options {
  /** Options for parisng LML */
  parse?: ParseConfig;
  /** Options for HTML output */
  output?: OutputConfig;
}

export type LMLRenderCallback = (err?: Error, rendered?: string) => void;

/**
 * Install LML view engine for your express app
 * @argument app Express application instance
 * @argument config options for parsing LML and outputting HTML
 */
export function loadViewEngine(app: Application, config?: Options): void {
  const globalParseConfig: ParseConfig = (config && typeof config === 'object' ? config : {}).parse || {};
  const globalOutputConfig: OutputConfig = (config && typeof config === 'object' ? config : {}).output || {};

  app.engine('lml', (filePath: string, options: Options, callback: LMLRenderCallback): void => {
    const parseConfig: ParseConfig = {...globalParseConfig, ...((options && typeof options === 'object' ? options : {}).parse || {})};
    const outputConfig: OutputConfig = {...globalOutputConfig, ...((options && typeof options === 'object' ? options : {}).output || {})};

    readFile(filePath, (err: Error, content: string | Buffer): void => {
      if (err) {
        callback(err);
        return;
      }
      try {
        callback(null, parseLML(content.toString(), parseConfig).toHTML(outputConfig));
      } catch (err) {
        callback(err);
        return;
      }
    });
  });

  app.set('view engine', 'lml');
}
