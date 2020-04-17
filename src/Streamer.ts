import { Transform, TransformCallback } from 'stream';

import { detect } from './CSV';
import { Parser } from './Parser';
import { Quote, Comma } from './types';

export class Streamer extends Transform {
  buffer: string;
  sep?: Comma;
  quo?: Quote;

  constructor(options?: { separator?: Comma; quote?: Quote }) {
    super({
      readableObjectMode: true,
      writableObjectMode: false,
    });
    // Transform.call(this, );
    this.buffer = '';
    this.sep = options && options.separator;
    this.quo = options && options.quote;
  }

  // overridden function with same signature
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform(chunk: any, _encoding: string, callback: TransformCallback): void {
    this.buffer = this.buffer.concat(chunk.toString());
    if (this.sep === undefined) {
      // try to detect the separator if not provided
      this.sep = detect(this.buffer);
    }

    const csv = new Parser(this.buffer, this.sep, this.quo);
    const rows = csv.File();

    if (csv.linePointer !== csv.pointer) {
      rows.pop();
    }
    this.buffer = this.buffer.slice(csv.linePointer);
    if (rows.length > 0) {
      rows.forEach((row) => {
        this.push(row);
      });
    }
    callback();
  }

  // TODO
  /*
  push(chunk: any, encoding?: string | undefined): boolean {
    throw new Error("Method not implemented.");
  }
  */

  _flush(callback: TransformCallback): void {
    const csv = new Parser(this.buffer, this.sep, this.quo);
    const rows = csv.File();
    if (rows.length > 0) {
      rows.forEach((row) => {
        this.push(row);
      });
    }
    callback();
  }
}
