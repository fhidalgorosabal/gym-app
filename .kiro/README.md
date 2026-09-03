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

> **La fuente de verdad del estado del proyecto es [wiki.md](./wiki.md).** Empieza por ahí.

| Archivo | Contenido |
|---------|-----------|
| [wiki.md](./wiki.md) | **Estado global y traspaso** (qué está hecho, decisiones, próximos pasos) |
| [fases.md](./fases.md) | Plan de implementación por fases (1–5 completas; 6–7 pendientes) |
| [assets.md](./assets.md) | Inventario de recursos disponibles (datos, imágenes, videos, traducciones) |
| [referencia-planixfit.md](./referencia-planixfit.md) | Análisis de PlanixFit como referencia de diseño |
| [setup-capacitor.md](./setup-capacitor.md) | Guía para compilar a Android |

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 22.1 (standalone components, signals) |
| Estilos | Tailwind CSS v4 + PostCSS |
| Testing | Vitest |
| Mobile | Capacitor 8 (Android) |
| Persistencia | localStorage (offline-first) |
| Formato | Prettier |
