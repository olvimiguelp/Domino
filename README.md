# Domino Score Tracker

**Domino Score Tracker** es una aplicación diseñada para gestionar y registrar las puntuaciones de juegos de dominó de manera sencilla y eficiente. La aplicación permite a los usuarios crear partidas, registrar rondas, calcular puntuaciones y determinar al ganador automáticamente. Además, incluye funcionalidades como historial de juegos, soporte multilenguaje y una interfaz intuitiva.

## Características principales

- **Gestión de partidas**: Crea nuevas partidas con un objetivo de puntuación y jugadores personalizados.
- **Registro de rondas**: Añade puntuaciones por ronda para cada jugador.
- **Cálculo automático**: Calcula las puntuaciones acumuladas y determina al ganador cuando se alcanza la puntuación objetivo.
- **Historial de juegos**: Consulta partidas anteriores con detalles como fecha, jugadores y puntuaciones finales.
- **Soporte multilenguaje**: Cambia entre inglés y español fácilmente.
- **Interfaz amigable**: Diseño moderno y responsivo para una experiencia de usuario óptima.

## Tecnologías utilizadas

- **React Native**: Framework principal para el desarrollo de la aplicación.
- **Expo**: Herramienta para simplificar el desarrollo y la construcción de la aplicación.
- **TypeScript**: Tipado estático para un código más robusto y mantenible.
- **AsyncStorage**: Almacenamiento local para guardar datos de partidas y configuraciones.
- **Lucide Icons**: Iconos modernos para mejorar la interfaz de usuario.

## Estructura del proyecto

El proyecto está organizado de la siguiente manera:

- **`app/`**: Contiene las pantallas principales de la aplicación, como el historial, la partida actual y la configuración.
- **`components/`**: Componentes reutilizables como botones, modales y entradas de texto.
- **`contexts/`**: Contextos para manejar el estado global, como partidas, puntuaciones y localización.
- **`constants/`**: Colores, cadenas de texto y configuraciones de diseño.
- **`hooks/`**: Hooks personalizados para funcionalidades específicas.
- **`types/`**: Definiciones de tipos TypeScript para garantizar consistencia en el código.

## Instalación y configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/domino-score-tracker.git
   cd domino-score-tracker
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**:
   ```bash
   npm run dev
   ```

4. **Construir para web** (opcional):
   ```bash
   npm run build:web
   ```

## Uso

1. **Crear una partida**:
   - Define la puntuación objetivo.
   - Añade jugadores con nombres personalizados.

2. **Registrar rondas**:
   - Introduce las puntuaciones de cada jugador en cada ronda.
   - La aplicación calcula automáticamente las puntuaciones acumuladas.

3. **Finalizar partida**:
   - La partida termina automáticamente cuando un jugador alcanza la puntuación objetivo.
   - Consulta el ganador en el modal de finalización.

4. **Historial de juegos**:
   - Revisa partidas anteriores con detalles como fecha, jugadores y puntuaciones finales.

## Configuración adicional

- **Cambio de idioma**:
  - Cambia entre inglés y español desde la pantalla de la partida actual.

- **Reinicio de puntuaciones**:
  - Reinicia las puntuaciones de la partida actual sin perder los jugadores ni la configuración.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m "Añadida nueva funcionalidad"
   ```
4. Envía un pull request.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

## Contacto

Si tienes preguntas o sugerencias, no dudes en contactar al desarrollador:

- **Nombre**: Olvin Miguel
- **Correo**: olvin@example.com
- **GitHub**: [github.com/olvinmiguel](https://github.com/olvinmiguel)

¡Gracias por usar **Domino Score Tracker**!
