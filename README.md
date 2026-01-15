# ZPL Printer - NativeScript App

Una aplicación móvil NativeScript con Angular para imprimir etiquetas ZPL a través de Bluetooth usando el plugin `ns-bxl-label`.

## 🚀 Características

- ✅ **Interfaz nativa** para iOS y Android
- ✅ **Plugin ns-bxl-label** integrado para impresión Bluetooth
- ✅ **Plantillas ZPL predefinidas** (Hola Mundo, Producto, Código de Barras, Envío)
- ✅ **Validación en tiempo real** de direcciones MAC y códigos ZPL
- ✅ **Registro de actividad** con logs coloridos y timestamps
- ✅ **Manejo de estados** de conexión e impresión
- ✅ **Permisos configurados** para Bluetooth en Android

## 📱 Requisitos del Sistema

### Para Desarrollo
- Node.js (versión 14 o superior)
- NativeScript CLI
- Android SDK (para compilar Android)
- Xcode (para compilar iOS - solo en macOS)

### Para Ejecución
- Android 5.0+ (API 21) o iOS 10.0+
- Bluetooth habilitado
- Impresora compatible con comandos ZPL

## 🛠️ Instalación y Configuración

### 1. Clonar el Proyecto
```bash
git clone <repository-url>
cd zpl-printer
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Android SDK

Para poder compilar y ejecutar en Android, necesitas configurar el Android SDK:

1. **Instalar Android Studio**: Descarga desde [developer.android.com](https://developer.android.com/studio)

2. **Configurar Variables de Entorno**:
   - `ANDROID_HOME`: Ruta al SDK de Android (ej: `C:\Android\sdk`)
   - `PATH`: Agregar `%ANDROID_HOME%\tools` y `%ANDROID_HOME%\platform-tools`

3. **Instalar SDK Targets**:
   ```bash
   sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
   ```

### 4. Verificar Configuración
```bash
tns doctor android
```

## 🏗️ Compilación

### Android
```bash
# Compilar
tns build android

# Compilar y ejecutar en dispositivo
tns run android

# Compilar y ejecutar en emulador
tns run android --emulator
```

### iOS (solo en macOS)
```bash
# Compilar
tns build ios

# Compilar y ejecutar en dispositivo
tns run ios --device

# Compilar y ejecutar en simulador
tns run ios --emulator
```

## 📖 Uso de la Aplicación

### 1. **Configuración de la Impresora**
   - Ingresa la dirección MAC de tu impresora Bluetooth
   - Formato válido: `00:11:22:33:44:55` o `00-11-22-33-44-55`

### 2. **Selección de Plantilla**
   - **Hola Mundo**: Texto simple
   - **Etiqueta de Producto**: Información con precio y fecha
   - **Con Código de Barras**: Incluye código Code 128
   - **Etiqueta de Envío**: Información de origen y destino

### 3. **Código ZPL Personalizado**
   - Edita el código ZPL directamente en el editor
   - Validación automática: debe contener `^XA` (inicio) y `^XZ` (fin)

### 4. **Impresión**
   - Toca "Imprimir Etiqueta"
   - Observa el estado de conexión y los logs en tiempo real

## 🔧 Plugin ns-bxl-label

### Instalación
```bash
npm install ns-bxl-label
```

### Uso Básico
```typescript
import { startBluetoothPrintFlow } from 'ns-bxl-label';

startBluetoothPrintFlow(
    "00:11:22:33:44:55", // MAC address
    "^XA^FO50,50^ADN,36,20^FDHola Mundo^FS^XZ", // ZPL code
    {
        onConnectionStateChanged: (state) => console.log(state),
        onPrintStarted: () => console.log("Impresión iniciada"),
        onPrintSuccess: () => console.log("Impresión exitosa"),
        onPrintError: (error) => console.log("Error:", error),
        onConnectionFailed: (error) => console.log("Conexión fallida:", error),
        onConnectionLost: () => console.log("Conexión perdida"),
    }
);
```

## 🎨 Plantillas ZPL Incluidas

### 1. Hola Mundo
```zpl
^XA^FO50,50^ADN,36,20^FDHola Mundo^FS^XZ
```

### 2. Etiqueta de Producto
```zpl
^XA^FO50,50^ADN,24,12^FDProducto: 12345^FS^FO50,100^ADN,18,10^FDPrecio: $99.99^FS^FO50,150^ADN,14,8^FDFecha: 15/01/2026^FS^XZ
```

### 3. Con Código de Barras
```zpl
^XA^FO50,50^ADN,24,12^FDProducto XYZ^FS^FO50,100^BCN,100,Y,N,N^FD123456789012^FS^FO50,220^ADN,18,10^FDCódigo: 123456789012^FS^XZ
```

### 4. Etiqueta de Envío
```zpl
^XA^FO50,50^ADN,20,10^FDDESTINO:^FS^FO50,80^ADN,24,12^FDJuan Pérez^FS^FO50,110^ADN,18,10^FDCalle 123, Ciudad^FS^FO50,140^ADN,18,10^FDCódigo Postal: 12345^FS^FO300,50^ADN,20,10^FDORIGEN:^FS^FO300,80^ADN,24,12^FDEmpresa ABC^FS^FO300,110^ADN,18,10^FDAv. Principal 456^FS^XZ
```

## 🔐 Permisos

### Android (ya configurado en AndroidManifest.xml)
```xml
<!-- Bluetooth básico -->
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>

<!-- Para Android 12+ -->
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
```

### iOS
Los permisos se manejan automáticamente cuando se usa Bluetooth.

## 🐛 Solución de Problemas

### 1. Plugin no encontrado
- Verifica que `ns-bxl-label` esté instalado: `npm ls ns-bxl-label`
- Limpia y reconstruye: `tns clean` + `tns build android`

### 2. Error de conexión Bluetooth
- Verifica que la impresora esté encendida y en modo de emparejamiento
- Confirma que la dirección MAC sea correcta
- Asegúrate de que los permisos estén otorgados en la app

### 3. Error de compilación Android
- Configura correctamente ANDROID_HOME
- Instala los Android SDK requeridos
- Ejecuta `tns doctor android` para diagnóstico

### 4. ZPL no imprime correctamente
- Verifica que el código ZPL sea válido (usar simuladores online)
- Asegúrate de que la impresora sea compatible con ZPL
- Revisa que la impresora tenga papel

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── printer/                    # Componente principal de impresión
│   │   ├── printer.component.html  # Template NativeScript
│   │   ├── printer.component.ts    # Lógica del componente
│   │   └── printer.component.css   # Estilos
│   ├── services/
│   │   └── zpl-printer.service.ts  # Servicio para manejar impresión
│   ├── app.component.ts            # Componente raíz
│   ├── app.routes.ts              # Configuración de rutas
│   └── ...
App_Resources/
├── Android/                        # Configuración Android
└── iOS/                           # Configuración iOS
```

## 🚧 Comandos ZPL Útiles

- `^XA` - Inicio de etiqueta
- `^XZ` - Fin de etiqueta
- `^FO` - Origen del campo (posición X,Y)
- `^AD` - Fuente predeterminada
- `^FD` - Datos del campo
- `^FS` - Separador de campo
- `^BC` - Código de barras Code 128
- `^BY` - Configuración de código de barras

## 🆘 Soporte

Para problemas específicos del plugin `ns-bxl-label`, consulta su documentación o repositorio.

Para problemas de NativeScript, visita [docs.nativescript.org](https://docs.nativescript.org)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.