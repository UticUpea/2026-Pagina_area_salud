<template>
  <header>

    <div class="container header-middle">
      <div class="row">
        <span class="col-xs-6 col-sm-3">
          <img :src="imageUrl + (Institucion?.institucion_logo || '')" 
               class="img-responsive" 
               alt="logo" 
               width="100" 
               height="100" />
        </span>
        
        <div class="col-xs-6 col-sm-9">
          <div class="contact clearfix">
            <ul class="hidden-xs">
              <li> 
                <span>Email</span>
                <a v-if="Institucion?.institucion_correo1?.trim()" 
                   :href="'mailto:' + Institucion.institucion_correo1.trim()"
                   target="_blank"
                   rel="noopener noreferrer">
                  {{ Institucion.institucion_correo1 }}
                </a>
                <br>
                <a v-if="Institucion?.institucion_correo2?.trim()" 
                   :href="'mailto:' + Institucion.institucion_correo2.trim()"
                   target="_blank"
                   rel="noopener noreferrer">
                  {{ Institucion.institucion_correo2 }}
                </a>
              </li>
              
              <li>
                <span>Teléfono</span>
                <a v-if="Institucion?.institucion_telefono1 && Institucion.institucion_telefono1 != 0"
                   :href="'tel:+591' + String(Institucion.institucion_telefono1).replace(/[^0-9]/g, '')">
                  {{ Institucion.institucion_telefono1 }}
                </a>
                <br>
                <a v-if="Institucion?.institucion_telefono2 && Institucion.institucion_telefono2 != 0"
                   :href="'tel:+591' + String(Institucion.institucion_telefono2).replace(/[^0-9]/g, '')">
                  {{ Institucion.institucion_telefono2 }}
                </a>
              </li>
            </ul>
            
            <a href="https://servicioadministrador.upea.bo/sign-in" 
               target="_blank" 
               rel="noopener noreferrer"
               class="login">
               INICIAR SESIÓN<span class="icon-more-icon"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex";
import api from '@/plugins/axios';

export default {
  name: "TopHeaderCustom",
  
  data() {
    return {
      sopen: false,
      m_inicio: false,
      m_conv: false,
      m_cur: false,
      m_mas: false,
      m_link: false,
    };
  },
  
  computed: {
    ...mapState(["url_api", "MenuConv", "MenuCur", "Institucion", "getter", "Links"]),
    
    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },
  },
  
  methods: {
    click_m() {
      this.$store.commit("clickLink");
     // this.$store.commit("idEncrypt");
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
        
        const links = res.data.linksExternoInterno || [];
        const filterLinks = links.filter(link => link.estado === 1 || link.ei_estado === "1");
        
        this.$store.commit('setLinks', filterLinks);
        
      } catch (error) {
        console.error('Error cargando Links en TopHeader:', error);
        
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
};
</script>