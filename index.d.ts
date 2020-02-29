declare namespace CsvString {
  import { Transform } from "stream";

  type rowElement = string | number | boolean;
  type row = rowElement[];
  type separator = "," | ";" | "|" | "\t";

  function parse(input: string, separator?: separator, quote?: string): row;
  function stringify(input: row, separator?: string): string;
  function detect(input: string): separator;
  function createStream(options?: {
    separator: separator;
    quote: string;
  }): Transform;

  type forEachCallback = (row: row, index: number) => undefined;

  function forEach(
    input: string,
    separator: string,
    quote: string,
    callback: forEachCallback
  ): void;

  function forEach(
    input: string,
    separator: string,
    callback: forEachCallback
  ): void;

  function forEach(input: string, callback: forEachCallback): void;

  type readCallback = (row: row) => undefined;

  function read(input: string, callback: readCallback): number;

  function read(
    input: string,
    separator: string,
    quote: string,
    callback: readCallback
  ): number;

  function read(
    input: string,
    separator: string,
    callback: readCallback
  ): number;

  type readAllCallback = readCallback;

  function readAll(input: string, callback: readCallback): number;

  function readAll(
    input: string,
    separator: string,
    quote: string,
    callback: readCallback
  ): number;

  function readAll(
    input: string,
    separator: string,
    callback: readCallback
  ): number;

  type readChunkCallback = readCallback;

  function readChunk(input: string, callback: readCallback): number;

  function readChunk(
    input: string,
    separator: string,
    quote: string,
    callback: readCallback
  ): number;

  function readChunk(
    input: string,
    separator: string,
    callback: readCallback
  ): number;
}

export = CsvString;
