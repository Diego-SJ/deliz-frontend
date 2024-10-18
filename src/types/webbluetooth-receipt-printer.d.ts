// @types/webbluetooth-receipt-printer.d.ts

declare module '@point-of-sale/webbluetooth-receipt-printer' {
  export default class WebBluetoothReceiptPrinter {
    constructor();

    connect(): Promise<void>;

    print(data: Uint8Array): void;

    addEventListener(event: 'connected' | 'disconnected' | string, listener: (device: any) => void): void;

    removeEventListener(event: 'connected' | 'disconnected' | string, listener: (device: any) => void): void;
  }
}
