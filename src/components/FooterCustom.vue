<template>
  <footer class="footer" :style="footerStyles">
    <div class="bottom" :style="{ background: colors.footerBg }">
      <div class="container">
        <div class="row">
          <div class="col-sm-4">
            <div class="connect-us">
              <br><br>
              <h3 :style="{ color: colors.text }">CONÉCTATE CON NOSOTROS</h3>
              <ul class="follow-us">
               
                <li v-if="institucionData?.institucion_facebook?.trim() && $isSafeLink(institucionData.institucion_facebook)">
                  <a :href="institucionData.institucion_facebook.trim()" 
                     target="_blank" rel="noopener noreferrer"
                     :style="{ color: colors.iconColor }">
                    <i class="fa fa-facebook" aria-hidden="true"></i>
                  </a>
                </li>
                <li v-if="institucionData?.institucion_twitter?.trim() && $isSafeLink(institucionData.institucion_twitter)">
                  <a :href="institucionData.institucion_twitter.trim()" 
                     target="_blank" rel="noopener noreferrer"
                     :style="{ color: colors.iconColor }">
                    <i class="fa fa-twitter" aria-hidden="true"></i>
                  </a>
                </li>
                <li v-if="institucionData?.institucion_youtube?.trim() && $isSafeLink(institucionData.institucion_youtube)">
                  <a :href="institucionData.institucion_youtube.trim()" 
                     target="_blank" rel="noopener noreferrer"
                     :style="{ color: colors.iconColor }">
                    <i class="fa fa-youtube-play" aria-hidden="true"></i>
                  </a>
                </li>
                
              
                <li v-if="institucionData?.institucion_celular1 && institucionData.institucion_celular1 != 0">
                  <a :href="buildWhatsAppUrl(institucionData.institucion_celular1)" 
                     target="_blank" rel="noopener noreferrer"
                     :style="{ color: colors.iconColor }">
                    <i class="fa fa-whatsapp" aria-hidden="true"></i>
                  </a>
                </li>
                <li v-if="institucionData?.institucion_celular2 && institucionData.institucion_celular2 != 0">
                  <a :href="buildWhatsAppUrl(institucionData.institucion_celular2)" 
                     target="_blank" rel="noopener noreferrer"
                     :style="{ color: colors.iconColor }">
                    <i class="fa fa-whatsapp" aria-hidden="true"></i>
                  </a>
                </li>
                
              
                <li v-if="institucionData?.institucion_correo2?.trim() && isValidEmail(institucionData.institucion_correo2)">
                  <a :href="'mailto:' + institucionData.institucion_correo2.trim()" 
                     target="_blank" rel="noopener noreferrer"
                     :style="{ color: colors.iconColor }">
                    <i class="fa fa-envelope" aria-hidden="true"></i>
                  </a>
                </li>
                
               
                <li v-if="institucionData?.institucion_telefono2 && institucionData.institucion_telefono2 != 0">
                  <a :href="'tel:+591' + String(institucionData.institucion_telefono2).replace(/[^0-9]/g, '')" 
                     target="_blank" rel="noopener noreferrer"
                     :style="{ color: colors.iconColor }">
                    <i class="fa fa-phone" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
              <br><br>
            </div>
          </div>
          
          <div class="col-sm-4">
            <div class="subscribe">
              <h3 :style="{ color: colors.text }">DIRECCIÓN</h3>
              <p :style="{ color: colors.textSecondary }">{{ institucionData?.institucion_direccion || 'Cargando...' }}</p>
              <h3 :style="{ color: colors.text }">HORARIO DE ATENCIÓN</h3>
              <p :style="{ color: colors.textSecondary }">Lunes-Viernes: 8:30am - 18:00pm</p>
              <p :style="{ color: colors.textSecondary }">Sábado: 9:00am - 14:00pm</p>
            </div>
          </div>
          
          <div class="col-sm-4">
            <div class="footer-logo hidden-xs">
              <img :src="buildSafeImageUrl(institucionData?.institucion_logo)" 
                   alt="logo" width="70" height="70"
                   style="display: inline-block; margin-right: 10px; border-radius: 8px;" />
              <a href="https://utic.upea.bo" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/utic.png" alt="SIE" width="70" height="70"
                  style="display: inline-block; margin-right: 10px; border-radius: 8px;" />
              </a>
              <a href="https://www.upea.bo" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/upea.png" alt="UPEA" width="70" height="70"
                  style="display: inline-block; border-radius: 8px;" />
              </a>
            </div>
            <p :style="{ color: colors.textSecondary }">
              © {{ currentYear }} 
              <span :style="{ color: colors.color_secundario, fontWeight: '600' }">
                Carrera de {{ formatNombreCarrera(institucionData?.institucion_nombre) || 'Cargando...' }}
              </span>. Todos los derechos reservados - by: Fernando Aguilar
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <a href="#" class="scroll-top" :style="{ background: colors.primary }">
    <i class="fa fa-chevron-up" aria-hidden="true" :style="{ color: colors.text }"></i>
  </a>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "FooterCustom",
  
  computed: {
    ...mapState(["Institucion", "MenuConv", "MenuCur", "url_api"]),
    
    institucionData() {
      const data = this.Institucion?.Descripcion || this.Institucion;
      if (!data || Object.keys(data).length === 0) {
        return {
          institucion_nombre: 'Cargando...', institucion_logo: '',
          institucion_direccion: 'Cargando...', institucion_facebook: '',
          institucion_twitter: '', institucion_youtube: '',
          institucion_celular1: null, institucion_celular2: null,
          institucion_correo1: '', institucion_correo2: '',
          institucion_telefono1: null, institucion_telefono2: null,
          institucion_historia: '', institucion_mision: '',
          institucion_vision: '', institucion_objetivos: '',
          institucion_organigrama: '', colorinstitucion: [],
          portada: [], autoridad: [],
        };
      }
      return data;
    },
    
    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        console.error('❌ VUE_APP_UPLOADS_URL no definida en producción');
        return '';
      }
      return url || (process.env.VUE_APP_ENV !== 'production' ? 'https://apiadministrador.upea.bo' : '');
    },

    currentYear() { return new Date().getFullYear(); },

    colors() {
      const colorList = this.Institucion?.colorinstitucion || [];
      const colors = colorList[0];
      
      if (colors) {
        const primary = colors.color_primario || '#C00014';
        const secondary = colors.color_secundario || '#FEFEFE';
        const tertiary = colors.color_terciario || '#F1EDEF';
        
        return {
          primary, secondary, tertiary,
          text: this.getContrastColor(primary),
          textSecondary: this.adjustColor(this.getContrastColor(primary), 50),
          iconColor: this.getContrastColor(primary),
          footerBg: `linear-gradient(135deg, ${primary} 0%, ${this.adjustColor(primary, -30)} 100%)`,
          hoverBg: 'rgba(255, 255, 255, 0.15)',
          border: 'rgba(255, 255, 255, 0.2)'
        };
      }
      
      return {
        primary: '#C00014', secondary: '#FEFEFE', tertiary: '#F1EDEF',
        text: '#FFFFFF', textSecondary: 'rgba(255, 255, 255, 0.8)',
        iconColor: '#FFFFFF',
        footerBg: 'linear-gradient(135deg, #C00014 0%, #8b000c 100%)',
        hoverBg: 'rgba(255, 255, 255, 0.15)', border: 'rgba(255, 255, 255, 0.2)'
      };
    },
    
    footerStyles() {
      return {
        borderTop: `3px solid ${this.colors.primary}`,
        boxShadow: `0 -2px 10px ${this.colors.primary}30`
      };
    }
  },
  
  methods: {
    buildSafeImageUrl(path) {
      if (!path) return '';
      const cleaned = String(path).trim();
      if (cleaned.startsWith('http')) {
        return cleaned.replace('http://', 'https://');
      }
      const base = this.imageUrl?.replace(/\/$/, '');
      return `${base}${cleaned.startsWith('/') ? cleaned : `/${cleaned}`}`;
    },
    

    buildWhatsAppUrl(celular) {
      if (!celular) return '#';
      const cleaned = String(celular).replace(/[^0-9]/g, '');
      return `https://wa.me/+591${cleaned}`;
    },
    

    isValidEmail(email) {
      if (!email) return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    },
    
    getContrastColor(hexColor) {
      if (!hexColor) return '#FFFFFF';
      const color = hexColor.replace('#', '');
      if (color.length !== 6) return '#FFFFFF';
      const r = parseInt(color.substr(0, 2), 16);
      const g = parseInt(color.substr(2, 2), 16);
      const b = parseInt(color.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    },

    adjustColor(color, amount) {
      if (!color) return color;
      const clean = color.replace('#', '');
      if (clean.length !== 6) return color;
      return '#' + clean.replace(/../g, hex => 
        ('0' + Math.min(255, Math.max(0, parseInt(hex, 16) + amount)).toString(16)).substr(-2)
      );
    },
    
    formatNombreCarrera(nombre) {
      if (!nombre) return '';
      return nombre.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
    },
  },
  
  mounted() {
    // if (process.env.NODE_ENV === 'development') {
    //     console.log(' Footer - Institución:', {
    //     id: this.institucionData?.institucion_id,
    //     nombre: this.institucionData?.institucion_nombre
    //   });
    // }
  }
};
</script>

<style scoped>

.footer { 
  margin-top: 0; 
  font-family: inherit; 
}
.footer .bottom { 
  padding: 40px 0 20px; 
  transition: background 0.3s ease; 
}
.footer h3 { 
  font-size: 16px; 
  font-weight: 700; 
  text-transform: uppercase; 
  margin-bottom: 20px; 
  letter-spacing: 0.5px; 
  transition: color 0.3s ease; 
}
.footer p { 
  font-size: 14px; 
  line-height: 1.6; 
  margin-bottom: 10px; 
  transition: color 0.3s ease; 
}

/* Iconos sociales */
.follow-us { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
  display: flex; 
  gap: 12px; 
  flex-wrap: wrap; 
}
.follow-us li a { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  width: 40px; height: 40px; 
  border-radius: 50%; 
  background: rgba(255, 255, 255, 0.15); 
  transition: all 0.3s ease; 
  text-decoration: none; 
}
.follow-us li a:hover { 
  transform: translateY(-3px); 
  background: rgba(255, 255, 255, 0.25); 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
}
.follow-us li a i { 
  font-size: 18px; 
  transition: transform 0.3s ease; 
}
.follow-us li a:hover i { 
  transform: scale(1.1); 
}

/* Logos */
.footer-logo { 
  display: flex; 
  align-items: center; 
  flex-wrap: wrap; 
  gap: 10px; 
  margin-bottom: 15px; 
}
.footer-logo img { 
  border-radius: 8px; 
  transition: transform 0.3s ease, 
  box-shadow 0.3s ease;
 }
.footer-logo img:hover { 
  transform: scale(1.05); 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
}

/* Copyright */
.footer .bottom p { 
  font-size: 13px; 
  opacity: 0.9; 
  margin-top: 15px; 
}
.footer .bottom p span { 
  font-weight: 600; 
}

/* Scroll to top */
.scroll-top { 
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 45px;
  height: 45px;
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  text-decoration: none; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
  transition: all 0.3s ease; 
  z-index: 999; 
}
.scroll-top:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); 
}
.scroll-top i { 
  font-size: 18px; 
}


@media (max-width: 768px) {
  .footer .bottom { 
    padding: 30px 0 15px; 
    text-align: center; 
  }
  .follow-us { 
    justify-content: center; 
  }
  .footer-logo { 
    justify-content: center; 
  }
  .scroll-top { 
    bottom: 15px; 
    right: 15px; 
    width: 40px; 
    height: 40px; 
  }
}
.color { 
  color: var(--main-color-3, currentColor); 
}
</style>