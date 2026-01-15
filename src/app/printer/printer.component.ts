import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZplPrinterService, ZplTemplate, PrintCallbacks } from '../services/zpl-printer.service';

export interface ActivityLog {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

@Component({
  selector: 'ns-printer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.css']
})
export class PrinterComponent implements OnInit {
  
  // Form data
  macAddress: string = '00:11:22:33:44:55';
  zplCode: string = '^XA^FO50,50^ADN,36,20^FDHola Mundo^FS^XZ';
  
  // UI state
  isConnecting: boolean = false;
  isPrinting: boolean = false;
  connectionStatus: string = 'Desconectado';
  
  // Data
  templates: ZplTemplate[] = [];
  logs: ActivityLog[] = [];

  constructor(private zplPrinterService: ZplPrinterService) { }

  ngOnInit(): void {
    this.templates = this.zplPrinterService.getTemplates();
    this.addLog('info', 'Aplicación iniciada - Lista para conectar con impresora');
  }

  selectTemplate(template: ZplTemplate): void {
    this.zplCode = template.code;
    this.addLog('info', `Plantilla seleccionada: ${template.name}`);
  }

  async printLabel(): Promise<void> {
    const macAddr = this.zplPrinterService.formatMacAddress(this.macAddress);
    const zplCommand = this.zplCode.trim();

    // Validation
    if (!this.zplPrinterService.isValidMacAddress(macAddr)) {
      this.addLog('error', 'Formato de dirección MAC inválido');
      return;
    }

    if (!this.zplPrinterService.isValidZplCode(zplCommand)) {
      this.addLog('error', 'Código ZPL inválido. Debe contener ^XA y ^XZ');
      return;
    }

    this.isConnecting = true;
    this.connectionStatus = 'Conectando...';
    this.addLog('info', `Iniciando conexión con impresora: ${macAddr}`);

    const callbacks: PrintCallbacks = {
      onConnectionStateChanged: (state: string) => {
        this.connectionStatus = state;
        this.addLog('info', `Estado: ${state}`);
      },

      onPrintStarted: () => {
        this.isConnecting = false;
        this.isPrinting = true;
        this.connectionStatus = 'Imprimiendo...';
        this.addLog('info', 'Iniciando impresión...');
      },

      onPrintSuccess: () => {
        this.isPrinting = false;
        this.isConnecting = false;
        this.connectionStatus = 'Impresión completada';
        this.addLog('success', '¡Impresión exitosa!');
      },

      onPrintError: (error: string) => {
        this.isPrinting = false;
        this.isConnecting = false;
        this.connectionStatus = 'Error de impresión';
        this.addLog('error', `Error de impresión: ${error}`);
      },

      onConnectionFailed: (error: string) => {
        this.isConnecting = false;
        this.isPrinting = false;
        this.connectionStatus = 'Conexión fallida';
        this.addLog('error', `Conexión fallida: ${error}`);
      },

      onConnectionLost: () => {
        this.isConnecting = false;
        this.isPrinting = false;
        this.connectionStatus = 'Conexión perdida';
        this.addLog('warning', 'Conexión perdida con la impresora');
      },

      showPrintingDialog: () => {
        this.addLog('info', 'Mostrando diálogo de impresión...');
      },

      hidePrintingDialog: () => {
        this.addLog('info', 'Ocultando diálogo de impresión...');
      }
    };

    try {
      await this.zplPrinterService.printLabel(macAddr, zplCommand, callbacks);
    } catch (error) {
      this.isConnecting = false;
      this.isPrinting = false;
      this.connectionStatus = 'Error';
      this.addLog('error', `Error: ${error.message || error}`);
    }
  }

  clearLogs(): void {
    this.logs = [];
    this.addLog('info', 'Registro de actividad limpiado');
  }

  canPrint(): boolean {
    return this.macAddress.trim().length > 0 && 
           this.zplCode.trim().length > 0;
  }

  getPrintButtonText(): string {
    if (this.isConnecting) return 'Conectando...';
    if (this.isPrinting) return 'Imprimiendo...';
    return 'Imprimir Etiqueta';
  }

  getStatusClass(): string {
    if (this.connectionStatus.includes('exitosa') || this.connectionStatus.includes('completada')) {
      return 'status-success';
    } else if (this.connectionStatus.includes('Error') || this.connectionStatus.includes('fallida') || this.connectionStatus.includes('perdida')) {
      return 'status-error';
    } else if (this.connectionStatus.includes('Conectando') || this.connectionStatus.includes('Imprimiendo')) {
      return 'status-connecting';
    }
    return 'status-disconnected';
  }

  private addLog(type: 'info' | 'success' | 'error' | 'warning', message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const log: ActivityLog = { timestamp, type, message };
    
    this.logs.unshift(log); // Add to beginning of array
    
    // Keep only last 20 logs
    if (this.logs.length > 20) {
      this.logs = this.logs.slice(0, 20);
    }
    
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
  }
}