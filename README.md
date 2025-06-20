# NeuralSeek Demos App

Este proyecto es una aplicación desarrollada con React y Next.js que presenta demos interactivas con diferentes propósitos. Cada demo se integra con una API de NeuralSeek. La estructura modular permite añadir fácilmente nuevas demostraciones sin afectar las existentes.

## Estructura del Proyecto

```
demos-page-app/
├── app/
│   └── (demos)/         # Contiene las demos individuales
├── api/
│   └── neuralseek/      # Define y organiza todas las rutas de integración con NeuralSeek
├── public/              # Archivos estáticos
├── styles/
│   └── limo.css         # Estilos personalizados
├── tailwind.config.ts   # Configuración de Tailwind CSS
├── package.json
└─ README.md
```

## Cómo iniciar el proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/CerebralBlue/demos-page.git
cd demos-page-app
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre el navegador en:

```
http://localhost:3000
```

## Cómo crear una nueva demo

1. Dentro de la carpeta `app/(demos)/`, crea una subcarpeta con el nombre de tu demo.

2. En esa carpeta, crea un archivo `page.tsx` con tu componente de React. Por ejemplo:

```tsx
"use client";
import React, { useState } from "react";
import axios from "axios";

export default function MiDemo() {
  const [respuesta, setRespuesta] = useState("");

  const consultarAPI = async () => {
    const res = await axios.post("/api/neuralseek/mi-endpoint", { prompt: "Hola" });
    setRespuesta(res.data.output);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Demo de NeuralSeek</h1>
      <button onClick={consultarAPI} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Consultar
      </button>
      <p className="mt-4">{respuesta}</p>
    </div>
  );
}
```

3. La demo aparecerá automáticamente como una ruta accesible en tu app.

## Configuración de APIs

Todas las rutas y claves de acceso a las APIs de NeuralSeek están centralizadas en la carpeta:

```
/api/neuralseek/
```

Cada archivo `route.ts` en esta carpeta define un endpoint. Para agregar uno nuevo:

1. Crea un archivo `nombre.route.ts`.
2. Implementa la lógica de conexión a NeuralSeek.
3. Utiliza variables de entorno para API keys si es necesario.

Ejemplo de endpoint:

```ts
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const response = await fetch("https://neuralseek-api.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEURALSEEK_KEY || "",
    },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  return Response.json(data);
}
```

## Tailwind CSS y estilos

Este proyecto utiliza Tailwind CSS como framework de estilos. Los estilos base están definidos en `tailwind.config.ts`. Además, se incluyen estilos personalizados en `styles/limo.css`.

Puedes usarlos importándolos en tus archivos de demo si necesitas formatos especiales para títulos, listas o markdown.

## Scripts disponibles

* `npm run dev`: Ejecuta el servidor en modo desarrollo.
* `npm run build`: Compila el proyecto para producción.
* `npm run start`: Inicia el servidor en producción.
* `npm run lint`: Ejecuta el linter.

## Requisitos

* Node.js 18 o superior
* npm 9 o superior