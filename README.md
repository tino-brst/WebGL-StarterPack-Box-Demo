# [WebGL StarterPack 📦](https://github.com/AgustinBrst/WebGL-StarterPack) - Box Demo

![](./docs/box.png)

### Requisitos
- [npm](https://www.npmjs.com/get-npm)

### Instalación

1. Descargar el [zip del repositorio](https://github.com/AgustinBrst/WebGL-StarterPack/archive/master.zip).
2. Descomprimirlo donde se quiera que quede el proyecto.
3. Desde la carpeta del proyecto ejecutar `npm install` para instalar todas las dependencias.

### Uso

El proyecto presenta los siguientes comandos:

- __`npm run dev`__ corre un servidor local en [`http://localhost:8080/`](http://localhost:8080/) y lo accede con el buscador por defecto, recompilando y refrescando su contenido automáticamente (i.e. [live reloading](#live-reloading)).

- __`npm run build`__ compila el proyecto y deja los archivos generados en la carpeta `dist/`, listos a ser publicados en un servidor (para la version final usar el comando siguiente).

- __`npm run production`__ compila el proyecto y deja los archivos generados en la carpeta `dist/`, esta vez aplicando una serie de optimizaciones teniendo en cuenta que ésta es la version que accederá el usuario final (minificación de javascript, etc).