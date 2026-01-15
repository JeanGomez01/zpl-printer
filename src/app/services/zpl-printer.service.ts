import { Injectable } from "@angular/core";
import { startBluetoothPrintFlow, PrinterCallbacks } from "ns-bxl-label";

export interface PrintCallbacks extends PrinterCallbacks {}

export interface ZplTemplate {
  name: string;
  code: string;
  description: string;
}

@Injectable({
  providedIn: "root",
})
export class ZplPrinterService {
  private readonly zplTemplates: ZplTemplate[] = [
    {
      name: "Hola test",
      code: "^XA^FO50,50^ADN,36,20^FDHola Mundo^FS^XZ",
      description: "Etiqueta básica con texto simple",
    },
    {
      name: "Etiqueta",
      code: "^XA^FO50,50^ADN,24,12^FDProducto: 12345^FS^FO50,100^ADN,18,10^FDPrecio: $99.99^FS^FO50,150^ADN,14,8^FDFecha: 15/01/2026^FS^XZ",
      description: "Etiqueta con información de producto, precio y fecha",
    },
  ];

  constructor() {
    console.log(
      "[ZPL Printer] ✅ startBluetoothPrintFlow imported successfully from ns-bxl-label"
    );
  }

  /**
   * Gets available ZPL templates
   */
  getTemplates(): ZplTemplate[] {
    return [...this.zplTemplates];
  }

  async printLabel(
    macAddress: string,
    zplCode: string,
    callbacks: PrintCallbacks = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log("[ZPL Printer] 🚀 Iniciando startBluetoothPrintFlow");
        console.log("[ZPL Printer] Printer Address:", macAddress);
        console.log("[ZPL Printer] ZPL Command:", zplCode);

        if (callbacks.onConnectionStateChanged) {
          callbacks.onConnectionStateChanged("Iniciando conexión Bluetooth...");
        }

        startBluetoothPrintFlow(
          macAddress, // printerAddress parameter
          zplCode, // zplCommand parameter
          {
            // PrinterCallbacks object
            onConnectionStateChanged: (status: string) => {
              console.log("[ZPL Printer] Estado de conexión:", status);
              if (callbacks.onConnectionStateChanged) {
                callbacks.onConnectionStateChanged(status);
              }
            },
            onPrintStarted: () => {
              console.log("[ZPL Printer]   Impresión iniciada");
              if (callbacks.onPrintStarted) {
                callbacks.onPrintStarted();
              }
            },

            onPrintSuccess: () => {
              console.log("[ZPL Printer]  Impresión exitosa");
              if (callbacks.onPrintSuccess) {
                callbacks.onPrintSuccess();
              }
              resolve();
            },

            onPrintError: (error: string) => {
              console.error("[ZPL Printer]  Error de impresión:", error);
              if (callbacks.onPrintError) {
                callbacks.onPrintError(error);
              }
              reject(new Error(error));
            },

            onConnectionFailed: (error: string) => {
              console.error("[ZPL Printer]  Error de conexión:", error);
              if (callbacks.onConnectionFailed) {
                callbacks.onConnectionFailed(error);
              }
              reject(new Error(error));
            },

            onConnectionLost: () => {
              console.warn("[ZPL Printer]  Conexión perdida");
              if (callbacks.onConnectionLost) {
                callbacks.onConnectionLost();
              }
            },

            showPrintingDialog: () => {
              console.log("[ZPL Printer]   Mostrando diálogo de impresión");
              if (callbacks.showPrintingDialog) {
                callbacks.showPrintingDialog();
              }
            },

            hidePrintingDialog: () => {
              console.log("[ZPL Printer]   Ocultando diálogo de impresión");
              if (callbacks.hidePrintingDialog) {
                callbacks.hidePrintingDialog();
              }
            },
          }
        );

        console.log(
          "[ZPL Printer]   startBluetoothPrintFlow llamado correctamente"
        );
      } catch (error) {
        console.error(
          "[ZPL Printer]  Error ejecutando startBluetoothPrintFlow:",
          error
        );
        if (callbacks.onPrintError) {
          callbacks.onPrintError(error.message || error.toString());
        }
        if (callbacks.onConnectionStateChanged) {
          callbacks.onConnectionStateChanged("Error");
        }
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
    return (
      trimmed.length > 0 && trimmed.includes("^XA") && trimmed.includes("^XZ")
    );
  }

  /**
   * Formats MAC address to standard format with colons
   */
  formatMacAddress(macAddress: string): string {
    return macAddress.trim().replace(/[-]/g, ":").toUpperCase();
  }

  /**
   * Creates a simple ZPL template with custom text
   */
  createSimpleTextLabel(text: string, x: number = 50, y: number = 50): string {
    return `^XA^FO${x},${y}^ADN,36,20^FD${text}^FS^XZ`;
  }

  /**
   * Check if ns-bxl-label package is available
   */
  isNsBxlLabelAvailable(): boolean {
    return typeof startBluetoothPrintFlow === "function";
  }

  /**
   * Get package status information
   */
  getPackageStatus(): { available: boolean; message: string } {
    const available = this.isNsBxlLabelAvailable();
    const message = available
      ? "✅ ns-bxl-label plugin importado correctamente"
      : "❌ ns-bxl-label no importado";

    return { available, message };
  }
}
