// @types/receipt-printer-encoder.d.ts

// text widths
// FONT A: 32 characters per line
// FONT B: 42 characters per line

declare module '@point-of-sale/receipt-printer-encoder' {
  interface ReceiptPrinterEncoderOptions {
    language?: string;
    codepageMapping?: string;
    width?: number;
  }

  type AlignOptions = 'left' | 'center' | 'right';

  interface ColumnOptions {
    width?: number;
    align?: AlignOptions;
    marginRight?: number;
  }

  interface RuleOptions {
    width?: number;
    style?: 'single' | 'double' | string;
  }

  type CellFunction = (encoder: ReceiptPrinterEncoder) => ReceiptPrinterEncoder;
  type CellContent = string | CellFunction;

  export default class ReceiptPrinterEncoder {
    constructor(options?: ReceiptPrinterEncoderOptions);

    initialize(): this;

    codepage(codepage: string): this;

    line(text: string): this;

    newline(): this;

    encode(): Uint8Array;

    text(text: string): this;

    size(width: number, height: number): this;

    align(align: AlignOptions): this;

    invert(enabled?: boolean): this;

    bold(enabled?: boolean): this;

    width(width: number): this;

    rule(options?: RuleOptions): this;

    table(columns: ColumnOptions[], rows: CellContent[][]): this;

    font(type: 'A' | 'B'): this;

    cut(): this;

    columns(number: number): this;
  }
}
