import DOMPurify from 'dompurify';

/**
 * ✅ Sanitiza HTML de la API para prevenir XSS
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
 * 
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
    const base = baseUrl?.replace(/\/$/, ''); // quitar slash final
    return `${base}${path}`;
  }
  

  if (/\.[a-z]{3,4}$/.test(path)) {
    const base = baseUrl?.replace(/\/$/, '');
    return `${base}/storage/imagenes/${path}`;
  }
  
  return null; // ruta inválida
};

/**
 * 
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
 * 
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


export const processPublicacion = (pub, baseUrl) => {
  if (!pub) return null;
  
  return {
    ...pub,
    publicaciones_titulo: sanitizeText(pub.publicaciones_titulo),
    publicaciones_descripcion: sanitizeHTML(pub.publicaciones_descripcion),
    publicaciones_imagen: buildAssetUrl(pub.publicaciones_imagen, baseUrl),
    publicaciones_autor: sanitizeText(pub.publicaciones_autor),

    publicaciones_documento: pub.publicaciones_documento && 
      /^[a-zA-Z0-9._\-\s]+\.(pdf|docx?|xlsx?|pptx?|jpg|jpeg|png|webp)$/i
        .test(pub.publicaciones_documento)
      ? pub.publicaciones_documento 
      : null
  };
};