# GymApp - Documentación del Proyecto

## Visión General

GymApp es una aplicación móvil de fitness que permite a los usuarios crear, gestionar y ejecutar rutinas de ejercicios personalizadas. La app se desarrolla con Angular 22 + Tailwind CSS y se compila a Android mediante Capacitor.

El proyecto se basa en la experiencia previa de **PlanixFit** (una app similar ya funcional), tomando su concepto y mejorándolo progresivamente.

## Qué tenemos ya

- **1324 ejercicios** con datos completos (nombre, categoría, músculo objetivo, equipamiento, instrucciones paso a paso)
- **Traducciones completas** en 3 idiomas: inglés (en), español (es), portugués brasileño (pt-BR)
- **1324 imágenes** thumbnail JPG (180x180) en `public/images/`
- **1324 GIFs animados** de demostración en `public/videos/`
- **Schema JSON** validado para la estructura de datos
- **Proyecto Angular 22** inicializado con Tailwind CSS v4 y Vitest

## Objetivo

Replicar y mejorar la funcionalidad de PlanixFit:
1. Gestión de rutinas por día de la semana
2. Ejecución de rutina con timer de descanso
3. Catálogo de ejercicios con búsqueda
4. Interfaz mobile-first
5. Compilación nativa a Android

## Estructura de Documentación

| Archivo | Contenido |
|---------|-----------|
| [assets.md](./assets.md) | Inventario de recursos disponibles (datos, imágenes, videos, traducciones) |
| [referencia-planixfit.md](./referencia-planixfit.md) | Análisis completo de PlanixFit como referencia de diseño |
| [setup-capacitor.md](./setup-capacitor.md) | Guía paso a paso para compilar a Android |
| [sqlite-strategy.md](./sqlite-strategy.md) | Estrategia de persistencia con SQLite (schema, setup, flujo) |
| [fases.md](./fases.md) | Plan de implementación por fases |

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 22.1 (standalone components) |
| Estilos | Tailwind CSS v4 + PostCSS |
| Testing | Vitest |
| Mobile | Capacitor (pendiente de instalar) |
| Persistencia | SQLite local (@capacitor-community/sqlite + jeep-sqlite para browser) |
| Formato | Prettier |
