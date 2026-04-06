<template>
  <TopHeaderCustom v-if="isHome" />

  <header id="header" class="sticky-header">
    <nav class="navbar navbar-inverse" :style="navbarStyles">
      <div class="container">

        <div class="navbar-header">
          <button 
            type="button" 
            class="navbar-toggle"
            :class="{ 'collapsed': isMenuCollapsed }"
            @click.stop="toggleMenu"
            :aria-expanded="!isMenuCollapsed"
            :style="{ borderColor: colors.border }"
          >
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar" :style="{ backgroundColor: colors.text }"></span>
            <span class="icon-bar" :style="{ backgroundColor: colors.text }"></span>
            <span class="icon-bar" :style="{ backgroundColor: colors.text }"></span>
          </button>
        </div>

        <div 
          class="navbar-collapse collapse" 
          :class="{ 'in': !isMenuCollapsed }"
          id="navbar"
          :style="{ background: colors.mobileBg }"
        >
          <ul class="nav navbar-nav navbar-center">
            <li class="dropdown" :class="{ 'open': activeDropdown === 'inicio' }">
              <router-link 
                to="/" 
                @click.stop.prevent="toggleDropdown('inicio')" 
                :style="{ color: colors.text }"
              >
                INICIO <i class="fa fa-angle-down" aria-hidden="true"></i>
              </router-link>
              <ul 
                class="dropdown-menu" 
                :style="{
                  background: colors.dropdownBg,
                  border: '2px solid ' + colors.primary
                }"
              >
                <li>
                  <router-link to="/about" @click="closeAll()" :style="{ color: colors.text }">
                    SOBRE NOSOTROS
                  </router-link>
                </li>
              </ul>
            </li>

            <li v-if="institucionData?.institucion_historia">
              <router-link to="/historia" @click="closeAll()" :style="{ color: colors.text }">HISTORIA</router-link>
            </li>

            <li class="dropdown" :class="{ 'open': activeDropdown === 'convocatorias' }">
              <a href="#" @click.stop.prevent="toggleDropdown('convocatorias')" :style="{ color: colors.text }">
                CONVOCATORIAS
                <i class="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <ul 
                class="dropdown-menu" 
                :style="{
                  background: colors.dropdownBg,
                  border: '2px solid ' + colors.primary
                }"
              >
                <li v-for="(mc, id_mc) of MenuConv" :key="mc.idtipo_conv_comun || id_mc">
                  <router-link
                    :to="'/convocatorias/' + mc.idtipo_conv_comun"
                    @click="closeAll()"
                    :style="{ 
                      color: colors.text,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }"
                  >
                    {{ mc.tipo_conv_comun_titulo }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="dropdown" :class="{ 'open': activeDropdown === 'cursos' }">
              <a href="#" @click.stop.prevent="toggleDropdown('cursos')" :style="{ color: colors.text }">
                CURSOS <i class="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <ul 
                class="dropdown-menu" 
                :style="{
                  background: colors.dropdownBg,
                  border: '2px solid ' + colors.primary
                }"
              >
                <li v-for="(mc, id_mc) of MenuCur" :key="mc.idtipo_curso_otros || id_mc">
                  <router-link
                    :to="'/cursos/' + mc.idtipo_curso_otros"
                    @click="closeAll()"
                    :style="{ 
                      color: colors.text,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }"
                  >
                    {{ mc.tipo_conv_curso_nombre }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="dropdown" :class="{ 'open': activeDropdown === 'mas' }">
              <a href="#" @click.stop.prevent="toggleDropdown('mas')" :style="{ color: colors.text }">
                MÁS <i class="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <ul 
                class="dropdown-menu" 
                :style="{
                  background: colors.dropdownBg,
                  border: '2px solid ' + colors.primary
                }"
              >
                <li>
                  <router-link to="/servicios" @click="closeAll()" :style="{ color: colors.text }">
                    SERVICIOS
                  </router-link>
                </li>
                <li>
                  <router-link to="/ofertas" @click="closeAll()" :style="{ color: colors.text }">
                    OFERTAS ACADÉMICAS
                  </router-link>
                </li>
                <li>
                  <router-link to="/publicaciones" @click="closeAll()" :style="{ color: colors.text }">
                    PUBLICACIONES
                  </router-link>
                </li>
                <li>
                  <router-link to="/gaceta" @click="closeAll()" :style="{ color: colors.text }">
                    GACETA
                  </router-link>
                </li>
                <li>
                  <router-link to="/eventos" @click="closeAll()" :style="{ color: colors.text }">
                    EVENTOS
                  </router-link>
                </li>
                <li>
                  <router-link to="/videos" @click="closeAll()" :style="{ color: colors.text }">
                    VIDEOS
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="dropdown" :class="{ 'open': activeDropdown === 'enlaces' }">
              <a href="#" @click.stop.prevent="toggleDropdown('enlaces')" :style="{ color: colors.text }">
                ENLACES <i class="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <ul 
                class="dropdown-menu" 
                :style="{
                  background: colors.dropdownBg,
                  border: '2px solid ' + colors.primary
                }"
              >
                <li v-for="(link, id_link) of linksData" :key="link.id_link || id_link">
                  <a 
                    v-if="getSafeLinkUrl(link)" 
                    :href="getSafeLinkUrl(link)" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    :title="link.ei_tipo || link.tipo"
                    @click="closeAll()"
                    :style="{ color: colors.text }"
                  >
                    {{ (link.ei_nombre || link.nombre)?.toUpperCase() }}
                  </a>
                  <span 
                    v-else 
                    :style="{ color: colors.text, opacity: 0.5, cursor: 'not-allowed' }"
                    :title="link.ei_nombre || link.nombre"
                  >
                    {{ (link.ei_nombre || link.nombre)?.toUpperCase() }} (enlace no disponible)
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from "vuex";
import TopHeaderCustom from "@/components/TopHeaderCustom.vue";
import api from '@/plugins/axios';

export default {
  name: "HeaderCustom",
  
  data() {
    return {
      sopen: false,
      m_inicio: false,
      m_conv: false,
      m_cur: false,
      m_mas: false,
      m_link: false,
      isHome: false,
      isMenuCollapsed: true,
      activeDropdown: null,
      isMobile: false,
    };
  },
  
  components: {
    TopHeaderCustom,
  },
  
  computed: {
    ...mapState(["url_api", "MenuConv", "MenuCur", "Institucion", "getter", "Links"]),
    
    institucionData() {
      return this.Institucion?.Descripcion || this.Institucion;
    },

    colors() {
      const colorList = this.Institucion?.colorinstitucion || [];
      const colors = colorList[0];
      
      if (colors) {
        const primary = colors.color_primario || '#C00014';
        const secondary = colors.color_secundario || '#FEFEFE';
        const tertiary = colors.color_terciario || '#F1EDEF';
        
        return {
          primary,
          secondary,
          tertiary,
          text: this.getContrastColor(primary),
          border: 'rgba(255, 255, 255, 0.3)',
          mobileBg: `linear-gradient(180deg, ${primary} 0%, ${this.adjustColor(primary, -30)} 100%)`,
          dropdownBg: primary,
          hoverBg: 'rgba(255, 255, 255, 0.15)'
        };
      }
      
      return {
        primary: '#C00014',
        secondary: '#FEFEFE',
        tertiary: '#F1EDEF',
        text: '#FFFFFF',
        border: 'rgba(255, 255, 255, 0.3)',
        mobileBg: 'linear-gradient(180deg, #C00014 0%, #8b000c 100%)',
        dropdownBg: '#C00014',
        hoverBg: 'rgba(255, 255, 255, 0.15)'
      };
    },

    navbarStyles() {
      return {
        background: `linear-gradient(135deg, ${this.colors.primary} 0%, ${this.adjustColor(this.colors.primary, -20)} 100%)`,
        boxShadow: `0 2px 10px ${this.colors.primary}40`
      };
    },

    dropdownStyles() {
      return {
        background: `linear-gradient(135deg, ${this.colors.dropdownBg} 0%, ${this.adjustColor(this.colors.dropdownBg, -20)} 100%)`,
        border: `2px solid ${this.colors.primary}`
      };
    },

    linksData() {
      return this.Links?.map(link => ({
        id_link: link.id_link || link.id || link.ei_id,
        ei_link: link.ei_link || link.url_link,
        ei_nombre: link.ei_nombre || link.nombre,
        ei_tipo: link.ei_tipo || link.tipo,
        ei_estado: link.ei_estado ?? link.estado,
      })) || [];
    },
  },
  
  methods: {
    getSafeLinkUrl(link) {
      if (!link) return null;
      const url = link.ei_link?.trim() || link.url_link?.trim();
      if (!url) return null;
      
      if (this.$isSafeLink?.(url)) {
        return url;
      }

      try {
        const normalized = url.startsWith('http') ? url : `https://${url}`;
        const parsed = new URL(normalized);
        if (parsed.protocol !== 'https:') return null;
        const allowed = ['upea.bo', 'youtube.com', 'youtu.be', 'facebook.com', 'twitter.com', 'x.com', 'whatsapp.com', 'google.com'];
        const hostname = parsed.hostname.replace(/^www\./, '');
        if (allowed.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
          return url;
        }
      } catch {
        return null;
      }
      return null;
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
    
    checkMobile() {
      this.isMobile = window.innerWidth <= 991;
    },
    
    toggleMenu() {
      this.isMenuCollapsed = !this.isMenuCollapsed;
      if (this.isMobile) {
        this.activeDropdown = null;
      }
    },
    
    toggleDropdown(dropdownName) {
      if (this.activeDropdown === dropdownName) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = dropdownName;
      }
    },
    
    closeAll() {
      this.activeDropdown = null;
      this.$store.commit("clickLink");
      if (this.isMobile) {
        setTimeout(() => {
          this.isMenuCollapsed = true;
        }, 150);
      }
    },
    
    handleClickOutside(event) {
      if (!this.$refs.navbar?.contains(event.target)) {
        if (!this.isMenuCollapsed) {
          this.isMenuCollapsed = true;
        }
        this.activeDropdown = null;
      }
    },
    
    async getLinks() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION;
        if (!idInstitucion && process.env.VUE_APP_ENV === 'production') {
          return;
        }
        const res = await api.get(`/institucion/${idInstitucion}/recursos`);
        const links = res.data.linksExternoInterno || res.data.LinksExternoInterno || [];
        const filterLinks = links
          .filter(link => link.estado === 1 || link.ei_estado === "1")
          .map(link => ({
            ...link,
            ei_link: link.ei_link || link.url_link,
            ei_nombre: link.ei_nombre || link.nombre,
            ei_tipo: link.ei_tipo || link.tipo,
          }));
        this.$store.commit('setLinks', filterLinks);
      } catch (error) {
        const isProd = process.env.VUE_APP_ENV === 'production';
        if (!isProd) {
          console.error('Error cargando Links:', error);
        }
        try {
          const idInstitucion = process.env.VUE_APP_ID_INSTITUCION;
          if (!idInstitucion) return;
          const res = await api.get(`/linksIntExtAll/${idInstitucion}`);
          const filterLinks = res.data.filter(link => link.ei_estado == "1");
          this.$store.commit('setLinks', filterLinks);
        } catch (err) {
          if (!isProd) console.error('Fallback failed');
        }
      }
    },
  },
  
  created() {
    this.isHome = this.$route.path === "/";
    if (!this.Links?.length) {
      this.getLinks();
    }
  },
  
  mounted() {
    if (this.getter) {
      this.getLinks();
      this.$store.commit('setGetter', false);
    }
    
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
    document.removeEventListener('click', this.handleClickOutside);
  },

  watch: {
    $route(to) {
      this.isHome = to.path === "/";
      if (this.isMobile) {
        this.isMenuCollapsed = true;
        this.activeDropdown = null;
      }
    },
  },
};
</script>

<style scoped>
.dropdown-menu {
  display: none;
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
  min-width: 280px !important;
  padding: 10px 0 !important;
  margin-top: 10px !important;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.dropdown.open > .dropdown-menu {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
}

.dropdown-menu > li > a {
  padding: 12px 20px !important;
  border: none !important;
  transition: all 0.3s ease !important;
  font-size: 13px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  display: block !important;
}

.dropdown-menu > li:last-child > a {
  border-bottom: none !important;
}

.dropdown-menu > li > a:hover {
  padding-left: 25px !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

#header {
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
}

.navbar-inverse {
  border: none;
  border-radius: 0;
  margin-bottom: 0;
  min-height: 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.navbar .container {
  position: relative;
}

.navbar-toggle {
  display: none;
  float: right;
  padding: 12px 15px;
  margin-top: 10px;
  margin-right: 0;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navbar-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.navbar-toggle:focus {
  outline: none;
}

.navbar-toggle .icon-bar {
  display: block;
  width: 24px;
  height: 3px;
  border-radius: 2px;
  margin: 4px 0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.navbar-toggle.collapsed .icon-bar:nth-child(1) { 
  transform: rotate(0) translateY(0); 
}
.navbar-toggle.collapsed .icon-bar:nth-child(2) { 
  opacity: 1; 
  transform: scaleX(1); 
}
.navbar-toggle.collapsed .icon-bar:nth-child(3) { 
  transform: rotate(0) translateY(0); 
}

.navbar-toggle:not(.collapsed) .icon-bar:nth-child(1) { 
  transform: rotate(45deg) translateY(7px); 
}
.navbar-toggle:not(.collapsed) .icon-bar:nth-child(2) { 
  opacity: 0; 
  transform: scaleX(0); 
}
.navbar-toggle:not(.collapsed) .icon-bar:nth-child(3) { 
  transform: rotate(-45deg) translateY(-7px); 
}

.navbar-nav {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.navbar-nav > li {
  float: none;
  display: inline-block;
  position: relative;
}

.navbar-nav > li > a,
.navbar-nav > li > router-link {
  padding: 20px 25px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.navbar-nav > li:last-child > a,
.navbar-nav > li:last-child > router-link {
  border-right: none;
}

.navbar-nav > li > a:hover,
.navbar-nav > li > router-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.navbar-nav > li > a::after,
.navbar-nav > li > router-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: currentColor;
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 2px;
}

.navbar-nav > li > a:hover::after,
.navbar-nav > li > router-link:hover::after {
  width: 60%;
}

@media (max-width: 991px) {
  .navbar-collapse.collapse {
    display: none !important;
  }
  .navbar-collapse.collapse.in {
    display: block !important;
  }

  .navbar-toggle {
    display: block;
    z-index: 1001;
  }

  .navbar-collapse {
    padding: 0;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-in-out;
    border-radius: 0 0 12px 12px;
    margin-top: 5px;
  }
  
  .navbar-collapse.in {
    max-height: 100vh;
    overflow-y: auto;
    animation: slideDown 0.4s ease;
  }
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .navbar-nav {
    display: block;
    width: 100%;
    margin: 0;
    padding: 10px 0;
  }
  
  .navbar-nav > li {
    display: block;
    float: none;
    margin: 5px 15px;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .navbar-nav > li:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .navbar-nav > li > a,
  .navbar-nav > li > router-link {
    padding: 16px 20px;
    border: none;
    font-size: 15px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
  }
  
  .navbar-nav > li > a::after,
  .navbar-nav > li > router-link::after {
    content: '›';
    font-size: 20px;
    opacity: 0.6;
    transition: all 0.3s ease;
  }
  
  .navbar-nav > li > a:hover::after,
  .navbar-nav > li > router-link:hover::after {
    opacity: 1;
    transform: translateX(5px);
  }

  .dropdown-menu {
    position: static !important;
    float: none !important;
    width: 100% !important;
    box-shadow: none !important;
    background: rgba(0, 0, 0, 0.2) !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease !important;
    display: block !important;
  }
  
  .dropdown.open > .dropdown-menu {
    max-height: 500px !important;
  }
  
  .dropdown-menu > li > a {
    padding: 14px 25px 14px 45px !important;
    font-size: 14px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    color: #fff !important;
  }
  
  .dropdown-menu > li > a:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    padding-left: 50px !important;
  }
  
  .navbar-collapse::-webkit-scrollbar { width: 6px; }
  .navbar-collapse::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); }
  .navbar-collapse::-webkit-scrollbar-thumb { 
    background: rgba(255, 255, 255, 0.3); 
    border-radius: 3px; 
  }
  .navbar-collapse::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
}

@media (min-width: 992px) {
  .navbar-collapse {
    display: flex !important;
    justify-content: center;
  }
  .navbar-collapse.collapse {
    display: flex !important;
  }
}
</style>