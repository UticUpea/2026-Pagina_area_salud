<template>
  <footer class="footer">
    <div class="bottom">
      <div class="container">
        <div class="row">
          <div class="col-sm-4">
            <div class="connect-us">
              <br><br>
              <h3>CONÉCTATE CON NOSOTROS</h3>
              <ul class="follow-us">

                <li v-if="institucionData?.institucion_facebook?.trim()">
                  <a :href="institucionData.institucion_facebook.trim()" 
                     target="_blank"
                     rel="noopener noreferrer">
                    <i class="fa fa-facebook" aria-hidden="true"></i>
                  </a>
                </li>
                <li v-if="institucionData?.institucion_twitter?.trim()">
                  <a :href="institucionData.institucion_twitter.trim()" 
                     target="_blank"
                     rel="noopener noreferrer">
                    <i class="fa fa-twitter" aria-hidden="true"></i>
                  </a>
                </li>
                
                <li v-if="institucionData?.institucion_youtube?.trim()">
                  <a :href="institucionData.institucion_youtube.trim()" 
                     target="_blank"
                     rel="noopener noreferrer">
                    <i class="fa fa-youtube-play" aria-hidden="true"></i>
                  </a>
                </li>
                
                <li v-if="institucionData?.institucion_celular1 && institucionData.institucion_celular1 != 0">
                  <a :href="'https://wa.me/+591' + String(institucionData.institucion_celular1).replace(/[^0-9]/g, '')" 
                     target="_blank"
                     rel="noopener noreferrer">
                    <i class="fa fa-whatsapp" aria-hidden="true"></i>
                  </a>
                </li>

                <li v-if="institucionData?.institucion_celular2 && institucionData.institucion_celular2 != 0">
                  <a :href="'https://wa.me/+591' + String(institucionData.institucion_celular2).replace(/[^0-9]/g, '')" 
                     target="_blank"
                     rel="noopener noreferrer">
                    <i class="fa fa-whatsapp" aria-hidden="true"></i>
                  </a>
                </li>
                
                
                <li v-if="institucionData?.institucion_correo2?.trim()">
                  <a :href="'mailto:' + institucionData.institucion_correo2.trim()" 
                     target="_blank"
                     rel="noopener noreferrer">
                    <i class="fa fa-envelope" aria-hidden="true"></i>
                  </a>
                </li>
                
                <li v-if="institucionData?.institucion_telefono2 && institucionData.institucion_telefono2 != 0">
                  <a :href="'tel:+591' + String(institucionData.institucion_telefono2).replace(/[^0-9]/g, '')" 
                     target="_blank"
                     rel="noopener noreferrer">
                    <i class="fa fa-phone" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
              <br><br>
            </div>
          </div>
          
          <div class="col-sm-4">
            <div class="subscribe">
              <h3>DIRECCIÓN</h3>
              <p>{{ institucionData?.institucion_direccion || 'Cargando...' }}</p>
              <h3>HORARIO DE ATENCIÓN</h3>
              <p>Lunes-Viernes: 8:30am - 18:00pm</p>
              <p>Sábado: 9:00am - 14:00pm</p>
            </div>
          </div>
          
          <div class="col-sm-4">
            <div class="footer-logo hidden-xs">
              <img :src="imageUrl + (institucionData?.institucion_logo || '')" 
                   alt="logo" width="70" height="70"
                   style="display: inline-block; margin-right: 10px;" />

              <a href="https://utic.upea.bo" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/utic.png" alt="SIE" width="70" height="70"
                  style="display: inline-block; margin-right: 10px;" />
              </a>
              <a href="https://www.upea.bo" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/upea.png" alt="UPEA" width="70" height="70"
                  style="display: inline-block;" />
              </a>
            </div>
            <p>© {{ currentYear }} <span>Carrera de {{ formatNombreCarrera(institucionData?.institucion_nombre) || 'Cargando...' }}</span>. Todos los derechos
              reservados - by: Fernando Aguilar</p>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <a href="#" class="scroll-top"><i class="fa fa-chevron-up" aria-hidden="true"></i></a>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "footerView",
  
  computed: {
    ...mapState(["Institucion", "MenuConv", "MenuCur", "url_api"]),
    
    institucionData() {
      const data = this.Institucion?.Descripcion || this.Institucion;
      
      if (!data || Object.keys(data).length === 0) {
        return {
          institucion_nombre: 'Cargando...',
          institucion_logo: '',
          institucion_direccion: 'Cargando...',
          institucion_facebook: '',
          institucion_twitter: '',
          institucion_youtube: '',
          institucion_celular1: null,
          institucion_celular2: null,
          institucion_correo1: '',
          institucion_correo2: '',
          institucion_telefono1: null,
          institucion_telefono2: null,
          institucion_historia: '',
          institucion_mision: '',
          institucion_vision: '',
          institucion_objetivos: '',
          institucion_organigrama: '',
          colorinstitucion: [],
          portada: [],
          autoridad: [],
        };
      }
      return data;
    },
    
    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },

    currentYear() {
      return new Date().getFullYear();
    }
  },
  
  methods: {
    formatNombreCarrera(nombre) {
      if (!nombre) return '';
      return nombre.split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ');
    },
  },
  
  // 👇 Debugging para confirmar que los datos llegan
  // mounted() {
  //   console.log(' Footer - Institucion:', this.Institucion);
  //   console.log(' Footer - institucionData:', this.institucionData);
  //   console.log(' Footer - Nombre:', this.institucionData?.institucion_nombre);
  // }
};
</script>

<style scoped>
.color { color: var(--main-color-3); }
</style>