# Setup: Compilar a Android con Capacitor

Guía para configurar el proyecto gym-app para compilarse como app Android nativa.

## Requisitos Previos

### En tu máquina (Windows)

| Software | Versión mínima | Para qué |
|----------|---------------|----------|
| Node.js | 20+ | Runtime (ya lo tenés) |
| Android Studio | 2024.2.1+ | IDE + emulador + SDK |
| Android SDK | API 23+ (recomendado: API 34-35) | Compilar la app |

> **No necesitás instalar JDK por separado** — Android Studio incluye el JDK correcto.

### Instalar Android Studio

1. Descargar desde https://developer.android.com/studio
2. Instalar con configuración por defecto
3. Al abrir por primera vez, dejar que descargue los componentes
4. Ir a **Tools → SDK Manager** e instalar al menos un SDK Platform (API 34 o 35)
5. Verificar que están instalados:
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android Emulator (para testing sin dispositivo físico)

### Variables de entorno (Windows)

Agregar a las variables de entorno del sistema:

```
ANDROID_HOME = C:\Users\<tu-usuario>\AppData\Local\Android\Sdk
```

Agregar al PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

## Instalación de Capacitor en el Proyecto

### Paso 1: Instalar dependencias

```bash
npm install @capacitor/core
npm install -D @capacitor/cli
```

### Paso 2: Inicializar Capacitor

```bash
npx cap init
```

Te pedirá:
- **App name:** GymApp
- **Package ID:** com.fernandev.gymapp (o el que prefieras)

Esto crea `capacitor.config.ts` en la raíz del proyecto.

### Paso 3: Configurar el archivo de configuración

Editar `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fernandev.gymapp',
  appName: 'GymApp',
  webDir: 'dist/gym-app/browser',  // Donde Angular pone el build
};

export default config;
```

> **Importante:** `webDir` debe apuntar al directorio de output de `ng build`. En Angular 22 con el nuevo builder, la salida va a `dist/<project-name>/browser`.

### Paso 4: Instalar plataforma Android

```bash
npm install @capacitor/android
npx cap add android
```

Esto crea la carpeta `android/` con el proyecto nativo.

## Flujo de Desarrollo

### Build y sincronización

```bash
# 1. Build de Angular
ng build

# 2. Copiar web assets al proyecto nativo
npx cap copy android

# 3. Sincronizar (copy + actualizar plugins nativos)
npx cap sync android
```

### Abrir en Android Studio

```bash
npx cap open android
```

Esto abre el proyecto en Android Studio donde podés:
- Ejecutar en emulador
- Ejecutar en dispositivo USB
- Generar APK/AAB para publicar

### Live Reload (desarrollo)

Para desarrollo rápido con hot reload en el dispositivo:

```bash
# Averiguar tu IP local
ipconfig

# Servir con host accesible
ng serve --host=0.0.0.0

# Luego configurar live reload en capacitor.config.ts (temporal):
# server: {
#   url: 'http://TU_IP:4200',
#   cleartext: true
# }

# Sincronizar y abrir
npx cap sync android
npx cap open android
```

> **Recordar:** Quitar la config de `server` antes de hacer build de producción.

## Generar APK para instalar

```bash
# Build de producción
ng build --configuration production

# Sincronizar
npx cap sync android

# Abrir Android Studio
npx cap open android
```

En Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**

El APK se genera en `android/app/build/outputs/apk/debug/app-debug.apk`.

## Generar íconos y splash screen

```bash
npm install -D @capacitor/assets

# Poner assets fuente en la raíz:
# - icon-only.png (1024x1024, sin fondo)
# - icon-background.png (2732x2732, fondo del ícono)
# - icon-foreground.png (2732x2732, foreground del ícono)
# - splash.png (2732x2732)
# - splash-dark.png (2732x2732, opcional)

npx capacitor-assets generate
```

## Estructura resultante

```
gym-app/
├── android/                # Proyecto nativo (commit al repo)
├── capacitor.config.ts     # Config de Capacitor
├── dist/gym-app/browser/   # Output de ng build (gitignored)
├── src/                    # Código Angular
└── ...
```

## Comandos Resumen

| Comando | Qué hace |
|---------|----------|
| `ng build` | Compila Angular a dist/ |
| `npx cap copy android` | Copia web assets al proyecto nativo |
| `npx cap sync android` | Copy + actualiza plugins nativos |
| `npx cap open android` | Abre en Android Studio |
| `npx cap run android` | Build + deploy a dispositivo/emulador |
| `npx capacitor-assets generate` | Genera íconos y splash |

## Notas

- La carpeta `android/` **debe** estar en el repo (es parte del proyecto)
- El `dist/` **no** va al repo (se genera con cada build)
- Si se agregan plugins nativos de Capacitor, correr `npx cap sync` después de instalar
- Para PlanixFit usaron Capacitor 7.4 — nosotros usaremos la última versión estable disponible
