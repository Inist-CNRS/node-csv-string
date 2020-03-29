import { Transform } from "stream";

import { detect } from "./CSV";
import { Parser } from "./Parser";

export class Streamer extends Transform {
  buffer: string;
  sep?: string;
  quo?: string;

  constructor(options?: { separator?: string; quote?: string }) {
    super({
      readableObjectMode: true,
      writableObjectMode: false,
    });
    // Transform.call(this, );
    this.buffer = "";
    this.sep = options && options.separator;
    this.quo = options && options.quote;
  }

  _transform(chunk, encoding, done): void {
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
    done();
  }

  // TODO
  /*
  push(chunk: any, encoding?: string | undefined): boolean {
    throw new Error("Method not implemented.");
  }
  */

  _flush(done): void {
    const csv = new Parser(this.buffer, this.sep, this.quo);
    const rows = csv.File();
    if (rows.length > 0) {
      rows.forEach((row) => {
        this.push(row);
      });
    }
    done();
  }
}
