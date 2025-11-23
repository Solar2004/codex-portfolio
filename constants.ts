
import type { HeaderMessage, Resources } from './types';

function shuffleArray<T,>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
}

export const HEADER_MESSAGES: HeaderMessage[] = shuffleArray([
    { en: "BREAKING: Developer spends 5 hours debugging only to find a missing semicolon;", es: "ÚLTIMA HORA: Un dev pasa 5 horas debuggeando solo para encontrar un punto y coma perdido;", },
    { en: "URGENT: Man loses will to live after Git merge conflict in production.", es: "URGENTE: Un dev pierde las ganas de vivir tras un merge conflict en producción.", },
    { en: "ALERT: Talking to rubber ducks improves code quality by 73%.", es: "ALERTA: Hablar con un rubber duck mejora la calidad del código en un 73%.", },
    { en: "NEWS FLASH: JavaScript dev finally understands 'this', immediately forgets.", es: "NOTICIA: Un dev de JavaScript finalmente entiende 'this'… y lo olvida al instante.", },
    { en: "JUST IN: CSS specificity wars leave thousands of divs unstyled.", es: "ÚLTIMO MOMENTO: Las guerras de specificity en CSS dejan miles de divs sin estilo.", },
    { en: "TRENDING: Local programmer's 'temporary fix' enters 7th year in production.", es: "TENDENCIA: Un 'fix temporal' de un dev entra en su séptimo año en producción.", },
    { en: "UPDATE: Stack Overflow goes down for 10 minutes, global productivity collapses.", es: "ACTUALIZACIÓN: Stack Overflow cae por 10 minutos y la productividad global colapsa.", },
    { en: "REPORT: Dev calls a bug 'impossible' moments before finding own typo.", es: "REPORTE: Un dev llama un bug 'impossible' segundos antes de encontrar su propio typo.", },
    { en: "EXCLUSIVE: 'It works on my machine' now valid in coding courts.", es: "EXCLUSIVA: 'Funciona en mi máquina' ahora aceptado en las cortes de programación.", },
    { en: "ALERT: Coffee intake directly correlated to lines of code written.", es: "ALERTA: La cantidad de café está directamente relacionada con las líneas de código escritas.", },
]);

export const RESOURCES: Resources = {
    en: {
      common: {
        siteName: "CODEX",
        showAllLangs: "Show all",
        back: "Back",
        read: "Read",
        byline: "crafted with ♡",
        empty: "Nothing here yet.",
        loading: "Loading posts...",
        loadingContent: "Loading content...",
        postNotFound: "404 - Post not found",
        knowledge: "Knowledge",
        selectAnArticle: "Select an article to begin your studies.",
      },
    },
    es: {
      common: {
        siteName: "CODEX",
        showAllLangs: "Mostrar todos",
        back: "Volver",
        read: "Leer",
        byline: "hecho con ♡",
        empty: "Aún no hay nada.",
        loading: "Cargando posts...",
        loadingContent: "Cargando contenido...",
        postNotFound: "404 - Post no encontrado",
        knowledge: "Conocimiento",
        selectAnArticle: "Selecciona un artículo para empezar tus estudios.",
      },
    },
};
