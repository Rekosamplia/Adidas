# adidas · Elige tu caja

Landing de campaña con 33 cajas (números 16 → 48). Al hacer clic en una caja se muestra el preloader del cordón deshaciéndose y, a continuación, un vale regalo: *"Acércate a la tienda de Adidas a por tu regalo"* con un premio inmediato aleatorio y, en algunas cajas, un doble premio vinculado a compra. El vale indica que el regalo se recoge en tienda mostrando el QR de la app.

Web estática, sin dependencias ni proceso de build: basta con abrir `index.html`.

## Estructura

```
index.html                 Landing completa (HTML + CSS + JS + SVG inline)
assets/
  cordon-preloader.svg     Preloader animado (SVG + SMIL, ~4 KB)
  logo-adidas-negro.svg    Logotipo (barras) en negro
  logo-adidas-blanco.svg   Logotipo (barras) en blanco
  qr-app.svg               QR de la app (versión optimizada del original de MATERIAL)
  favicon.svg
tools/
  generar-preloader.js     Genera cordon-preloader.svg a partir de las poses del cordón
```

## Configuración

En el `<script>` de `index.html`:

| Variable    | Valor | Qué hace                                      |
|-------------|-------|-----------------------------------------------|
| `FIRST`     | `16`  | Número de la primera caja                     |
| `COUNT`     | `33`  | Número de cajas (16 → 48)                     |
| `LOADER_MS` | `1900`| Duración del preloader antes de abrir el vale |
| `PREMIOS_INMEDIATOS` | lista | Premio que se asigna siempre (aleatorio) |
| `PREMIOS_COMPRA` | lista | Doble premio condicionado a compra mínima (aleatorio) |
| `PROB_DOBLE` | `0.3` | Probabilidad de que una caja incluya doble premio (30 %) |

Cada caja conserva el premio asignado mientras el usuario no recargue la página.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a un repositorio.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. La web quedará en `https://<usuario>.github.io/<repositorio>/`.

> Nota: en el plan gratuito, GitHub Pages solo publica repositorios públicos. Si el repositorio debe ser privado (material de cliente), hace falta un plan de pago o publicarlo en otro servicio (Netlify, Vercel…).

## Editar el preloader

El preloader va incrustado en `index.html` (para que la animación pueda reiniciarse en cada clic). Si lo modificas:

```bash
node tools/generar-preloader.js assets/cordon-preloader.svg
```

y sustituye el bloque `<svg …aria-label="Cargando">…</svg>` dentro de `<div class="loader">` en `index.html` por el contenido del nuevo archivo.
