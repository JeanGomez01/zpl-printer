import { Injectable } from '@angular/core';
import { startBluetoothPrintFlow } from 'ns-bxl-label';

export interface PrintCallbacks {
  onConnectionStateChanged?: (state: string) => void;
  onPrintStarted?: () => void;
  onPrintSuccess?: () => void;
  onPrintError?: (error: string) => void;
  onConnectionFailed?: (error: string) => void;
  onConnectionLost?: () => void;
  showPrintingDialog?: () => void;
  hidePrintingDialog?: () => void;
}

export interface ZplTemplate {
  name: string;
  code: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ZplPrinterService {
  
  private readonly zplTemplates: ZplTemplate[] = [
    {
      name: 'Hola Mundo',
      code: '^XA^FO50,50^ADN,36,20^FDHola Mundo^FS^XZ',
      description: 'Etiqueta básica con texto simple'
    },
    {
      name: 'Etiqueta de Producto',
      code: '^XA^FO50,50^ADN,24,12^FDProducto: 12345^FS^FO50,100^ADN,18,10^FDPrecio: $99.99^FS^FO50,150^ADN,14,8^FDFecha: 15/01/2026^FS^XZ',
      description: 'Etiqueta con información de producto, precio y fecha'
    },
    {
      name: 'Con Código de Barras',
      code: '^XA^FO50,50^ADN,24,12^FDProducto XYZ^FS^FO50,100^BCN,100,Y,N,N^FD123456789012^FS^FO50,220^ADN,18,10^FDCódigo: 123456789012^FS^XZ',
      description: 'Etiqueta con texto y código de barras Code 128'
    },
    {
      name: 'Etiqueta de Envío',
      code: '^XA^FO50,50^ADN,20,10^FDDESTINO:^FS^FO50,80^ADN,24,12^FDJuan Pérez^FS^FO50,110^ADN,18,10^FDCalle 123, Ciudad^FS^FO50,140^ADN,18,10^FDCódigo Postal: 12345^FS^FO300,50^ADN,20,10^FDORIGEN:^FS^FO300,80^ADN,24,12^FDEmpresa ABC^FS^FO300,110^ADN,18,10^FDAv. Principal 456^FS^XZ',
      description: 'Etiqueta de envío con información de origen y destino'
    }
  ];

  constructor() { }

  /**
   * Gets available ZPL templates
   */
  getTemplates(): ZplTemplate[] {
    return [...this.zplTemplates];
  }

  /**
   * Starts the Bluetooth printing flow using the ns-bxl-label plugin
   */
  async printLabel(
    macAddress: string,
    zplCode: string,
    callbacks: PrintCallbacks = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        startBluetoothPrintFlow(
          macAddress,
          
        );
      } catch (error) {
        console.error('[ZPL Printer] Error starting print flow:', error);
        reject(error);
      }
    });
  }

  /**
   * Validates MAC address format
   */
  isValidMacAddress(macAddress: string): boolean {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(macAddress.trim());
  }

  /**
   * Validates ZPL code format (basic validation)
   */
  isValidZplCode(zplCode: string): boolean {
    const trimmed = zplCode.trim();
    return trimmed.length > 0 && 
           trimmed.includes('^XA') && 
           trimmed.includes('^XZ');
  }

  /**
   * Formats MAC address to standard format with colons
   */
  formatMacAddress(macAddress: string): string {
    return macAddress.trim()
      .replace(/[-]/g, ':')
      .toUpperCase();
  }

  /**
   * Creates a simple ZPL template with custom text
   */
  createSimpleTextLabel(text: string, x: number = 50, y: number = 50): string {
    return `^XA^FO${x},${y}^ADN,36,20^FD${text}^FS^XZ`;
  }
}