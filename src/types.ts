export type LineBreak = '\r\n' | '\n' | '\r';
export type Comma = ',' | ';' | '|' | '\t';
export type Quote = '"' | string;
export type Residue = ' ' | '\t' | '\f' | string;
export type Value = string;
export type PristineInput =
  | string
  | number
  | null
  | undefined
  | { [key: string]: PristineInput }
  | PristineInput[];
export type ReadCallback = (row: Value[]) => void;
export type ReadAllCallback = (rows: Value[][]) => void;
export type ForEachCallback = (row: Value[], index: number) => void;
export type ParseOptions = {
  comma: Comma;
  quote: Quote;
  output: 'objects' | 'tuples';
}
