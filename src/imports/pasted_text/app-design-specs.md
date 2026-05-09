NUEVAS SECCIONES A DISEÑAR
Agrega las siguientes secciones a la app existente. Todas deben integrarse en la navegación principal mediante una barra de navegación inferior con 5 íconos: Escanear | Colección | Comunidad | Aprender | Perfil ( esto en versión móvil, en versión escritorio tienes que adaptarlo para que se vea bien y funcione bien).

1. PANTALLA DE INICIO / DASHBOARD
La pantalla de bienvenida de ahorita está perfecta, qué de primeras se pueda agregar una foto para identificar sin iniciar sesión, pero que haya una invitación para registrarte para acceder a todas las funciones de la app (juegos, gamificación, social).
 
Si ya está iniciada la sesión:
Saludo con nombre del usuario y su avatar circular
Racha diaria (streak): número de días consecutivos usando la app, con ícono de llama y animación sutil
Barra de XP del día: cuántos puntos ha ganado hoy vs. la meta diaria (ej. "320 / 500 XP")
Tarjeta de reto diario: "Escanea una libélula del género Libellula hoy" con barra de progreso y recompensa visible (ej. +150 XP, 1 especie rara)
Actividad reciente de amigos: lista compacta tipo feed — avatar + nombre + acción ("Ana encontró Pantala flavescens")
Un botón CTA grande central: "Escanear ahora" con efecto glassmorphism o gradiente vibrante
2. COLECCIÓN — "OdonaDex"
Inspirada en la Pokédex. Es la colección personal de odonatos encontrados por el usuario.
Vista principal:
Encabezado con contador: "47 / 312 especies descubiertas" + barra de progreso circular
Filtros horizontales scrollables: Todos | Libélulas | Caballitos del diablo | Por región | Por rareza
Grid 2×N de tarjetas de especie. Cada tarjeta tiene:
Ilustración o foto de la especie (si no ha sido descubierta: silueta gris con signo "?" y efecto blur/desaturado)
Nombre común debajo
Badge de rareza en esquina superior: Común (gris) / Poco común (verde) / Rara (azul) / Épica (morada) / Legendaria (dorada con brillo)
Si fue descubierta por el usuario: fecha de primer avistamiento en pequeño
Si aún no: texto "???" en lugar del nombre
Vista detalle de especie (al tocar una tarjeta descubierta):
Foto/ilustración grande
Nombre científico + nombre común
Heat map de características diagnósticas (heredado del diseño existente)
Datos curiosos
Mapa de hábitat
Badge "Primera captura" si el usuario fue el primero en registrarla en la app globalmente
Botón: "Compartir descubrimiento"
3. COMUNIDAD — Sección Social
Pantalla principal:
Feed de actividad global/amigos (mismo estilo que Instagram/Twitter pero minimalista):
Avatar + nombre + "encontró [especie]" + miniatura de foto tomada + hace X tiempo
Botones de reacción: 🔥 Impresionante / ❤️ Me encanta!
Leaderboard semanal: top 5 usuarios con más XP esa semana, con podio animado para los 3 primeros
Botón "Ver mi perfil" y "Buscar usuarios"

Pantalla de perfil de usuario:
Banner superior con foto/paisaje, avatar circular encima
Nombre de usuario + bio corta
Estadísticas en fila horizontal: Especies: 47 | XP total: 12,340 | Racha: 14 días
Badges/logros ganados: cuadrícula de íconos con nombre (ej. "Primer escaneo", "Noctámbulo", "Colector épico")
Grilla de sus últimas especies encontradas (mismo estilo OdonaDex)
Botón "Seguir" si es perfil ajeno

4.  APRENDER — Modo Juego x2
Esta sección tiene dos modos de juego claramente diferenciados. La pantalla de entrada muestra ambas opciones como tarjetas grandes con ilustración, nombre y descripción breve.
🔍 MODO 1: "¿Qué especie es?" — Identificación guiada
Inspirado en Duolingo + juego de decisiones tipo árbol. El objetivo es que el usuario llegue a identificar una especie respondiendo preguntas sobre características visibles.
Flujo de la pantalla:
Pantalla de inicio del reto: foto grande de una libélula (real o ilustración) + título "¿Puedes identificarla?" + nivel de dificultad (Fácil/Medio/Difícil) + botón "Comenzar"
Pantalla de pregunta / decisión (se repite 3–6 veces):
Foto de la libélula arriba (siempre visible, puede hacer zoom)
Pregunta en texto grande: "¿De qué color es el abdomen?"
2 a 4 opciones como botones grandes con ilustración pequeña o ícono + texto. Al seleccionar una opción, se marca y avanza automáticamente a la siguiente pregunta (decisión en árbol)
Indicador de progreso: barra o pasos numerados arriba (Paso 2 de 5)
Botón flotante "¡Ya sé la respuesta!" — aparece desde el paso 2 en adelante, en esquina inferior derecha, con estilo secundario (outline o ghost). Al tocarlo, salta directo a la pantalla de respuesta final
Pantalla de respuesta final:
Muestra 3–4 especies posibles como tarjetas seleccionables con foto, nombre científico y nombre común
El usuario elige la que cree correcta
Botón grande "¡Esta es!"
Pantalla de resultado:
Si acertó: animación de confetti o partículas, ícono de check grande, texto "¡Correcto! Es Sympetrum striolatum" + XP ganados flotando (+100 XP)
Si falló: animación suave de shake/error, texto "Casi… Era Sympetrum striolatum", explicación breve de por qué
En ambos casos: heat map de la especie resaltando las características clave que se preguntaron, texto explicativo de cada rasgo
Botón "Agregar a mi OdonaDex" (si no la tenía) y "Jugar de nuevo"
📚 MODO 2: "Academia Odonata" — Aprende conceptos
Modo educativo para aprender terminología, biología y curiosidades de las libélulas. Inspirado en flashcards + quiz.
Pantalla principal del modo:
Lista de módulos temáticos como tarjetas horizontales scrollables:
🦟 "Anatomía básica" (completado 3/5)
💧 "Ciclo de vida"
🌍 "Hábitats del mundo"
🎨 "Coloración y camuflaje"
🔬 "Cómo identificar subfamilias"
Cada módulo muestra: ícono temático, título, barra de progreso, XP al completar
Botón "Módulo del día" destacado arriba
Pantalla de lección (dentro de un módulo): Alterna entre distintos tipos de pantalla:
Tipo A — Flashcard informativa: ilustración o foto grande arriba, concepto en texto grande al centro (ej. "Pterostigma"), definición breve abajo, botón "Entendido →"
Tipo B — Quiz de opción múltiple: pregunta en texto + 4 opciones de respuesta como botones. Al seleccionar: verde si correcto (con check ✓ y explicación breve), rojo si incorrecto (con X y la respuesta correcta resaltada en verde). Botón "Siguiente"
Tipo C — Arrastra y conecta: dos columnas — nombres a la izquierda, definiciones/imágenes a la derecha. El usuario conecta con líneas. Diseñar estado "conectado" (línea activa de color) y estado "correcto/incorrecto" post-revisión
Tipo D — Señala en la imagen: foto de libélula con puntos pulsantes sobre partes del cuerpo. Al tocar un punto, aparece un tooltip con el nombre de esa parte. Al final, pregunta "¿Dónde está el pterostigma?" y el usuario debe tocar el punto correcto
Pantalla de fin de módulo:
Resumen: X de Y respuestas correctas
XP ganados + animación
Nuevo badge desbloqueado si corresponde
Botón "Siguiente módulo" y "Ver mi progreso"
5. 🏆 SISTEMA DE PROGRESIÓN Y XP
Diseña los siguientes elementos visuales del sistema de gamificación (pueden aparecer como componentes reutilizables o en pantallas específicas):
Barra de nivel XP: barra horizontal con degradado de color según nivel, número de nivel en círculo al inicio, porcentaje de progreso al siguiente nivel al final
Notificación de subida de nivel: modal o toast celebratorio — "¡Subiste al Nivel 8! 🎉 Entomólogo Avanzado" con animación de burst/confetti
Sistema de badges: diseña al menos 8 badges con ícono y nombre. Ejemplos:
🔭 "Primer vistazo" — primer escaneo
🌊 "Acuático" — 10 especies de hábitat acuático
⚡ "Velocidad" — responder sin pistas
📅 "Dedicado" — 7 días de racha
🌍 "Viajero" — especies de 3 continentes
👑 "Maestro Odonata" — 200 especies descubiertas
🌙 "Noctámbulo" — escanear después de las 9pm
🎯 "Sin pistas" — identificar sin usar el árbol de decisiones
Toast de XP ganado: aparece flotando sobre cualquier pantalla al ganar puntos — "+50 XP ⚡" con animación de rise and fade

LINEAMIENTOS DE DISEÑO
Mantén la identidad visual del diseño existente: paleta de colores, tipografía, estilo de íconos y tono general
Los nuevos elementos deben sentirse como parte orgánica del mismo sistema, no como añadidos externos
Usa micro-animaciones donde sea apropiado: transiciones de pantalla, feedback de respuestas, celebraciones de XP
La app debe funcionar cómodamente en modo oscuro como modo principal (si el diseño existente ya lo usa)
Las tarjetas de especie no descubierta deben usar blur + desaturación para generar misterio sin revelar
Elementos de juego (barras de XP, contadores, badges) deben tener un toque de neón sutil o brillo para dar energía sin romper la seriedad científica de la app
Accesibilidad: todos los textos deben tener suficiente contraste. Los elementos interactivos deben tener estado hover/pressed claramente diferenciado
Toda la interfaz tiene que ser clara, no amontonar tantos elementos ni texto, se debe mantener la funcionalidad que tiene ahora.