# 🎨 Sistema de Diseño - ChatBot IA Frontend

## 📋 Índice
- [Introducción](#introducción)
- [Colores](#colores)
- [Tipografía](#tipografía)
- [Componentes](#componentes)
- [Espaciado](#espaciado)
- [Sombras](#sombras)
- [Animaciones](#animaciones)
- [Modo Oscuro](#modo-oscuro)
- [Responsive Design](#responsive-design)
- [Utilidades](#utilidades)

## 🎯 Introducción

Este sistema de diseño está basado en los diseños proporcionados en la carpeta `stitch_bandeja_de_entrada_de_mensajes` y utiliza Tailwind CSS como base. El sistema está diseñado para ser consistente, accesible y fácil de mantener.

### Características Principales:
- **Consistencia**: Todos los componentes siguen las mismas reglas de diseño
- **Accesibilidad**: Cumple con estándares WCAG 2.1
- **Modo Oscuro**: Soporte completo para tema oscuro
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Performance**: Optimizado para carga rápida

## 🎨 Colores

### Colores Primarios
```css
--color-primary: #1173d4        /* Azul corporativo principal */
--color-background-light: #f6f7f8  /* Fondo claro */
--color-background-dark: #101922    /* Fondo oscuro */
```

### Paleta de Colores
```css
/* Primary */
primary-50: #eff6ff
primary-100: #dbeafe
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #1173d4  /* Color principal */
primary-600: #1d4ed8
primary-700: #1e40af
primary-800: #1e3a8a
primary-900: #1e3a8a

/* Success */
success-50: #f0fdf4
success-100: #dcfce7
success-200: #bbf7d0
success-300: #86efac
success-400: #4ade80
success-500: #22c55e
success-600: #16a34a
success-700: #15803d
success-800: #166534
success-900: #14532d

/* Warning */
warning-50: #fffbeb
warning-100: #fef3c7
warning-200: #fde68a
warning-300: #fcd34d
warning-400: #fbbf24
warning-500: #f59e0b
warning-600: #d97706
warning-700: #b45309
warning-800: #92400e
warning-900: #78350f

/* Error */
error-50: #fef2f2
error-100: #fee2e2
error-200: #fecaca
error-300: #fca5a5
error-400: #f87171
error-500: #ef4444
error-600: #dc2626
error-700: #b91c1c
error-800: #991b1b
error-900: #7f1d1d
```

## 📝 Tipografía

### Fuente Principal
- **Familia**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700
- **Fallback**: system-ui, -apple-system, sans-serif

### Jerarquía Tipográfica
```css
/* Títulos */
h1: text-4xl font-bold (36px)
h2: text-3xl font-bold (30px)
h3: text-2xl font-bold (24px)
h4: text-xl font-bold (20px)
h5: text-lg font-bold (18px)
h6: text-base font-bold (16px)

/* Texto */
body: text-base font-normal (16px)
small: text-sm font-normal (14px)
caption: text-xs font-normal (12px)
```

## 🧩 Componentes

### Botones

#### Botón Primario
```html
<button class="btn-primary">
  Botón Primario
</button>
```

#### Botón Secundario
```html
<button class="btn-secondary">
  Botón Secundario
</button>
```

#### Botón Outline
```html
<button class="btn-outline">
  Botón Outline
</button>
```

#### Botón Ghost
```html
<button class="btn-ghost">
  Botón Ghost
</button>
```

#### Botón Danger
```html
<button class="btn-danger">
  Botón Danger
</button>
```

### Inputs

#### Input Primario
```html
<input class="input-primary" placeholder="Escribe aquí..." />
```

#### Input con Error
```html
<input class="input-error" placeholder="Campo con error" />
```

### Cards

#### Card Default
```html
<div class="card-default p-6">
  Contenido de la card
</div>
```

#### Card Elevated
```html
<div class="card-elevated p-6">
  Card con elevación
</div>
```

#### Card Outlined
```html
<div class="card-outlined p-6">
  Card con borde
</div>
```

### Enterprise Components

#### Enterprise Card
```html
<div class="enterprise-card p-8">
  <h2 class="text-2xl font-bold text-white mb-4">Título</h2>
  <p class="text-white/70">Contenido de la card enterprise</p>
</div>
```

#### Enterprise Stats Card
```html
<div class="enterprise-stats-card">
  <div class="text-3xl font-bold text-gray-900">123</div>
  <div class="text-gray-600 text-sm">Estadística</div>
</div>
```

## 📏 Espaciado

### Sistema de Espaciado
```css
/* Espaciado base */
space-1: 0.25rem (4px)
space-2: 0.5rem (8px)
space-3: 0.75rem (12px)
space-4: 1rem (16px)
space-5: 1.25rem (20px)
space-6: 1.5rem (24px)
space-8: 2rem (32px)
space-10: 2.5rem (40px)
space-12: 3rem (48px)
space-16: 4rem (64px)
space-20: 5rem (80px)
space-24: 6rem (96px)

/* Espaciado personalizado */
space-18: 4.5rem (72px)
space-88: 22rem (352px)
space-128: 32rem (512px)
```

## 🌟 Sombras

### Sistema de Sombras
```css
/* Sombras suaves */
shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)

/* Sombras medias */
shadow-medium: 0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)

/* Sombras fuertes */
shadow-strong: 0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)
```

## 🎬 Animaciones

### Animaciones Disponibles
```css
/* Fade In */
.animate-fade-in

/* Slide Up */
.animate-slide-up

/* Slide Down */
.animate-slide-down

/* Scale In */
.animate-scale-in
```

### Efectos de Hover
```css
/* Card Hover */
.card-hover

/* Button Hover */
.btn-hover
```

## 🌙 Modo Oscuro

### Activación
El modo oscuro se activa automáticamente basándose en la preferencia del sistema del usuario o se puede controlar manualmente con la clase `dark:`.

### Ejemplo de Uso
```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Contenido que se adapta al modo oscuro
</div>
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Ejemplo de Uso
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Grid responsive -->
</div>
```

## 🛠️ Utilidades

### Scrollbar Hide
```html
<div class="scrollbar-hide overflow-y-auto">
  Contenido con scrollbar oculta
</div>
```

### Line Clamp
```html
<p class="line-clamp-2">
  Texto que se corta en 2 líneas
</p>
```

### Text Gradient
```html
<h1 class="text-gradient">
  Título con gradiente
</h1>
```

## 🎯 Mejores Prácticas

### 1. Consistencia
- Usa siempre las clases del sistema de diseño
- Mantén la jerarquía tipográfica
- Respeta los espaciados definidos

### 2. Accesibilidad
- Usa contraste adecuado entre texto y fondo
- Incluye estados de focus visibles
- Proporciona texto alternativo para imágenes

### 3. Performance
- Usa las clases de Tailwind en lugar de CSS personalizado
- Optimiza las imágenes
- Minimiza el uso de animaciones complejas

### 4. Responsive
- Diseña mobile-first
- Usa breakpoints apropiados
- Prueba en diferentes dispositivos

## 🔧 Personalización

### Variables CSS
Puedes personalizar el sistema modificando las variables CSS en `src/app/globals.css`:

```css
:root {
  --color-primary: #1173d4;
  --color-background-light: #f6f7f8;
  --color-background-dark: #101922;
  /* ... más variables */
}
```

### Configuración de Tailwind
Modifica `tailwind.config.js` para agregar nuevos colores, espaciados o componentes:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Nuevos colores
      },
      spacing: {
        // Nuevos espaciados
      }
    }
  }
}
```

## 📚 Recursos Adicionales

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Guía de Accesibilidad WCAG](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- [Figma - Diseños Originales](./stitch_bandeja_de_entrada_de_mensajes/)

---

**Nota**: Este sistema de diseño está en constante evolución. Si encuentras inconsistencias o tienes sugerencias de mejora, por favor documenta los cambios necesarios.
