import DOMPurify from 'dompurify';

/**
 * Sanitiza contenido HTML para prevenir XSS
 * @param {string} html - Contenido HTML crudo de la API
 * @returns {string} HTML limpio y seguro
 */
export const sanitizeHTML = (html) => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'strong', 'em', 'u', 'ul', 'ol', 'li', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'br', 'a', 'img', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'class'],
    ADD_ATTR: ['target'],
    FORCE_TARGET: '_blank',
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });
};

/**
 * Construye URL segura para assets (imágenes, documentos)
 * @param {string} path - Ruta relativa o absoluta
 * @param {string} baseUrl - URL base de uploads
 * @returns {string|null} URL completa válida o null si es inválida
 */
export const buildAssetUrl = (path, baseUrl) => {
  if (!path) return null;

  if (path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('http://')) {
    return path.replace('http://', 'https://');
  }

  if (path.startsWith('/')) {
    const base = baseUrl?.replace(/\/$/, '');
    return `${base}${path}`;
  }

  if (/\.[a-z]{3,4}$/.test(path)) {
    const base = baseUrl?.replace(/\/$/, '');
    return `${base}/storage/imagenes/${path}`;
  }
  
  return null;
};

/**
 * Valida que una URL externa pertenezca a un dominio permitido
 * @param {string} url - URL a validar
 * @param {Array<string>} allowedDomains - Dominios permitidos
 * @returns {boolean} True si es seguro usar la URL
 */
export const isSafeExternalUrl = (url, allowedDomains = [
  'upea.bo', 'youtube.com', 'youtu.be', 'facebook.com', 
  'twitter.com', 'x.com', 'whatsapp.com', 'google.com'
]) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(normalized);
    
    if (parsed.protocol !== 'https:') return false;
    
    const hostname = parsed.hostname.replace(/^www\./, '');
    return allowedDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

/**
 * Sanitiza texto plano eliminando HTML y escapando caracteres especiales
 * @param {string} text - Texto crudo
 * @returns {string} Texto limpio sin HTML ni scripts
 */
export const sanitizeText = (text) => {
  if (!text) return '';

  return String(text)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>\"'&]/g, char => ({
      '<': '&lt;', '>': '&gt;', '"': '&quot;', 
      "'": '&#x27;', '&': '&amp;'
    })[char]);
};

/**
 * Procesa datos de autoridad aplicando sanitización y validación de URLs
 * @param {Object} autoridad - Objeto de autoridad crudo
 * @param {string} baseUrl - URL base para imágenes
 * @returns {Object|null} Autoridad procesada o null si es inválida
 */
export const processAutoridad = (autoridad, baseUrl) => {
  if (!autoridad) return null;
  
  return {
    ...autoridad,
    nombre_autoridad: sanitizeText(autoridad.nombre_autoridad),
    cargo_autoridad: sanitizeText(autoridad.cargo_autoridad),
    foto_autoridad: buildAssetUrl(autoridad.foto_autoridad, baseUrl),
    facebook_autoridad: isSafeExternalUrl(autoridad.facebook_autoridad) 
      ? autoridad.facebook_autoridad 
      : '#',
    twiter_autoridad: isSafeExternalUrl(autoridad.twiter_autoridad) 
      ? autoridad.twiter_autoridad 
      : '#'
  };
};

/**
 * Procesa datos de publicación aplicando sanitización y validación
 * @param {Object} pub - Objeto de publicación crudo
 * @param {string} baseUrl - URL base para imágenes
 * @returns {Object|null} Publicación procesada o null si es inválida
 */
export const processPublicacion = (pub, baseUrl) => {
  if (!pub) return null;
  
  const docRegex = /^[a-zA-Z0-9._\-\s]+\.(pdf|docx?|xlsx?|pptx?|jpg|jpeg|png|webp)$/i;
  
  return {
    ...pub,
    publicaciones_titulo: sanitizeText(pub.publicaciones_titulo),
    publicaciones_descripcion: sanitizeHTML(pub.publicaciones_descripcion),
    publicaciones_imagen: buildAssetUrl(pub.publicaciones_imagen, baseUrl),
    publicaciones_autor: sanitizeText(pub.publicaciones_autor),
    publicaciones_documento: pub.publicaciones_documento && docRegex.test(pub.publicaciones_documento)
      ? pub.publicaciones_documento 
      : null
  };
};