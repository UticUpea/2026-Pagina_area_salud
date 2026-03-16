<template>
  <TopHeaderCustom v-if="isHome" />

  <header id="header" class="sticky-header">
    <nav class="navbar navbar-inverse" :style="navbarStyles">
      <div class="container">

        <div class="navbar-header">
          <button 
            type="button" 
            class="navbar-toggle collapsed"
            @click="toggleMenu"
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
            <li class="dropdown">
              <router-link data-toggle="dropdown" to="/" :style="{ color: colors.text }"
                >INICIO <i class="fa fa-angle-down" aria-hidden="true"></i
              ></router-link>
              <ul class="dropdown-menu" :style="dropdownStyles">
                <li>
                  <router-link to="/about" @click="click_m()" :style="{ color: colors.text }"
                    >SOBRE NOSOTROS</router-link
                  >
                </li>
              </ul>
            </li>

            <li v-if="institucionData?.institucion_historia">
              <router-link to="/historia" :style="{ color: colors.text }">HISTORIA</router-link>
            </li>

            <li class="dropdown">
              <a data-toggle="dropdown" href="#" :style="{ color: colors.text }"
                >CONVOCATORIAS
                <i class="fa fa-angle-down" aria-hidden="true"></i
              ></a>
              <ul class="dropdown-menu" :style="dropdownStyles">
                <li v-for="(mc, id_mc) of MenuConv" :key="mc.idtipo_conv_comun || id_mc">
                  <router-link
                    :to="'/convocatorias/' + mc.idtipo_conv_comun"
                    @click="click_m()"
                    :style="{ color: colors.text, borderBottomColor: colors.primary }"
                  >
                    {{ mc.tipo_conv_comun_titulo }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="dropdown">
              <a data-toggle="dropdown" href="#" :style="{ color: colors.text }"
                >CURSOS <i class="fa fa-angle-down" aria-hidden="true"></i
              ></a>
              <ul class="dropdown-menu" :style="dropdownStyles">
                <li v-for="(mc, id_mc) of MenuCur" :key="mc.idtipo_curso_otros || id_mc">
                  <router-link
                    :to="'/cursos/' + mc.idtipo_curso_otros"
                    @click="click_m()"
                    :style="{ color: colors.text, borderBottomColor: colors.primary }"
                  >
                    {{ mc.tipo_conv_curso_nombre }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="dropdown">
              <a data-toggle="dropdown" href="#" :style="{ color: colors.text }"
                >MÁS <i class="fa fa-angle-down" aria-hidden="true"></i
              ></a>
              <ul class="dropdown-menu" :style="dropdownStyles">
                <li>
                  <router-link to="/servicios" @click="click_m()" :style="{ color: colors.text }"
                    >SERVICIOS</router-link
                  >
                </li>
                <li>
                  <router-link to="/ofertas" @click="click_m()" :style="{ color: colors.text }"
                    >OFERTAS ACADÉMICAS</router-link
                  >
                </li>
                <li>
                  <router-link to="/publicaciones" @click="click_m()" :style="{ color: colors.text }"
                    >PUBLICACIONES</router-link
                  >
                </li>
                <li>
                  <router-link to="/gaceta" @click="click_m()" :style="{ color: colors.text }"
                    >GACETA</router-link
                  >
                </li>
                <li>
                  <router-link to="/eventos" @click="click_m()" :style="{ color: colors.text }"
                    >EVENTOS</router-link
                  >
                </li>
                <li>
                  <router-link to="/videos" @click="click_m()" :style="{ color: colors.text }"
                    >VIDEOS</router-link
                  >
                </li>
              </ul>
            </li>

            <li class="dropdown">
              <a data-toggle="dropdown" href="#" :style="{ color: colors.text }"
                >ENLACES <i class="fa fa-angle-down" aria-hidden="true"></i
              ></a>
              <ul class="dropdown-menu" :style="dropdownStyles">
                <li v-for="(link, id_link) of linksData" :key="link.id_link || id_link">
                  <a :href="link.ei_link?.trim() || link.url_link?.trim()" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     :title="link.ei_tipo || link.tipo"
                     :style="{ color: colors.text }"
                  >
                    {{ (link.ei_nombre || link.nombre)?.toUpperCase() }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>

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

.navbar-toggle.collapsed .icon-bar:nth-child(1) { transform: rotate(0) translateY(0); }
.navbar-toggle.collapsed .icon-bar:nth-child(2) { opacity: 1; transform: scaleX(1); }
.navbar-toggle.collapsed .icon-bar:nth-child(3) { transform: rotate(0) translateY(0); }

.navbar-toggle:not(.collapsed) .icon-bar:nth-child(1) { transform: rotate(45deg) translateY(7px); }
.navbar-toggle:not(.collapsed) .icon-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.navbar-toggle:not(.collapsed) .icon-bar:nth-child(3) { transform: rotate(-45deg) translateY(-7px); }


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

.dropdown-menu {
  border: none;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  min-width: 280px;
  padding: 10px 0;
  margin-top: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.dropdown.open > .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu > li > a {
  padding: 12px 20px;
  border: none;
  transition: all 0.3s ease;
  font-size: 13px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-menu > li:last-child > a {
  border-bottom: none;
}

.dropdown-menu > li > a:hover {
  padding-left: 25px;
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 991px) {
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
    position: static;
    float: none;
    width: 100%;
    box-shadow: none;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0;
    margin: 0;
    padding: 0;
    opacity: 1;
    visibility: visible;
    transform: none;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .dropdown.open > .dropdown-menu {
    max-height: 500px;
  }
  
  .dropdown-menu > li > a {
    padding: 14px 25px 14px 45px;
    font-size: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .dropdown-menu > li > a:hover {
    background: rgba(255, 255, 255, 0.1);
    padding-left: 50px;
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

<script>
import { mapState } from "vuex";
import TopHeaderCustom from "@/components/TopHeaderCustom.vue";
import api from '@/plugins/axios';

export default {
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
      const colors = this.Institucion?.colorinstitucion?.find(c => c.id_color === 9);
      
      if (colors) {
        return {
          primary: colors.color_primario || '#C00014',     
          secondary: colors.color_secundario || '#FEFEFE',  
          tertiary: colors.color_terciario || '#F1EDEF',   
          text: '#FFFFFF',                      
          border: 'rgba(255, 255, 255, 0.3)',    
          mobileBg: 'linear-gradient(180deg, #C00014 0%, #8b000c 100%)',
          dropdownBg: '#C00014',                        
          hoverBg: 'rgba(255, 255, 255, 0.1)'
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
        hoverBg: 'rgba(255, 255, 255, 0.1)'
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

    adjustColor(color, amount) {
      return '#' + color.replace(/^#/, '').replace(/../g, color => 
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
      );
    },
    
    toggleMenu() {
      this.isMenuCollapsed = !this.isMenuCollapsed;
    },
    
    click_m() {
      this.$store.commit("clickLink");
      if (window.innerWidth <= 991) {
        this.isMenuCollapsed = true;
      }
      this.openMenu();
    },
    
    showSubMenu(id) {
      const menus = { m_inicio: false, m_conv: false, m_cur: false, m_mas: false, m_link: false };
      if (Object.hasOwn(menus, id)) {
        this[id] = true;
        Object.keys(menus).forEach(key => {
          if (key !== id) this[key] = false;
        });
      }
    },
    
    openMenu() {
      this.sopen = !this.sopen;
    },
    
    async getLinks() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION;
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
        console.error('Error cargando Links:', error);
        try {
          const res = await api.get(`/linksIntExtAll/${process.env.VUE_APP_ID_INSTITUCION}`);
          const filterLinks = res.data.filter(link => link.ei_estado == "1");
          this.$store.commit('setLinks', filterLinks);
        } catch (err) {
          console.error('Fallback failed:', err);
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
  },

  watch: {
    $route(to) {
      this.isHome = to.path === "/";
      if (window.innerWidth <= 991) {
        this.isMenuCollapsed = true;
      }
    },
  },
};
</script>