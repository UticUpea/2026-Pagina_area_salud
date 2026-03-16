<template>
  <div class="blog-right">
    <div class="category">
      <h3>Categorías</h3>
      <ul class="left-aligned">

        <!-- Convocatorias -->
        <li v-for="(conv, id_conv) of MenuConv" :key="conv.idtipo_conv_comun || id_conv">
          <router-link :to="'/convocatorias/' + conv.idtipo_conv_comun" @click="$store.commit('clickLink')">
            {{ formatTitle(conv.tipo_conv_comun_titulo) }}
            <span>{{ contarConv(conv.tipo_conv_comun_titulo) }}</span>  
          </router-link>
        </li>

        <!-- Cursos -->
        <li v-for="(cur, id_cur) of MenuCur" :key="cur.idtipo_curso_otros || id_cur">
          <router-link :to="'/cursos/' + cur.idtipo_curso_otros" @click="$store.commit('clickLink')">
            {{ formatTitle(cur.tipo_conv_curso_nombre) }}
            <span>{{ contarCur(cur.tipo_conv_curso_nombre) }}</span>
          </router-link>
        </li>

        <!-- Otras categorías -->
        <li>
          <router-link to="/servicios" @click="$store.commit('clickLink')">
             Servicios <span>{{ serviciosCount }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/ofertas" @click="$store.commit('clickLink')">
             Ofertas académicas <span>{{ ofertasCount }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/publicaciones" @click="$store.commit('clickLink')">
             Publicaciones <span>{{ publicacionesCount }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/gaceta" @click="$store.commit('clickLink')">
             Gaceta <span>{{ gacetaCount }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/eventos" @click="$store.commit('clickLink')">
             Eventos <span>{{ eventosCount }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/videos" @click="$store.commit('clickLink')">
             Videos <span>{{ videosCount }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="tags">
      <h3>Tags</h3>
      <ul class="tags-list clearfix left-aligned">
        <li v-for="(link, id_link) of linksData" :key="link.id_link || id_link">
          <a :href="link.ei_link?.trim() || link.url_link?.trim()" 
             target="_blank" 
             rel="noopener noreferrer"
             :title="link.ei_tipo || link.tipo">
            {{ (link.ei_nombre || link.nombre)?.toUpperCase() }}<br>
          </a>
        </li>
        <li>
          <a href="https://utic.upea.bo" target="_blank" rel="noopener noreferrer">UTIC UPEA</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.left-aligned { text-align: left; }
.category ul li { list-style: none; padding: 8px 0; border-bottom: 1px solid #eee; }
.category ul li a { display: flex; justify-content: space-between; align-items: center; text-decoration: none; color: inherit; }
.category ul li a:hover { color: var(--main-color); }
.category ul li span { 
  background: var(--main-color); 
  color: #fff; 
  padding: 2px 8px; 
  border-radius: 12px; 
  font-size: 0.85rem;
  min-width: 24px;
  text-align: center;
  display: inline-block;
}
.tags-list li { display: inline-block; margin: 4px; }
.tags-list a { 
  display: inline-block; 
  padding: 4px 10px; 
  background: #f5f5f5; 
  border-radius: 4px; 
  text-decoration: none; 
  color: #333; 
  font-size: 0.9rem; 
  transition: background 0.3s; 
}
.tags-list a:hover { background: var(--main-color); color: #fff; }
</style>

<script>
import { mapState } from "vuex";

export default {
  name: "SidebarCustom",
  
  computed: {
    ...mapState([
      "MenuConv", 
      "MenuCur", 
      "Links", 
      "convocatorias",    
      "cursos",           
      "servicios",        
      "ofertas",          
      "publicaciones",    
      "gacetas",          
      "eventos",          
      "videos",          
    ]),
    
    linksData() {
      return this.Links?.map(link => ({
        id_link: link.id_link || link.id || link.ei_id,
        ei_link: link.ei_link || link.url_link,
        ei_nombre: link.ei_nombre || link.nombre,
        ei_tipo: link.ei_tipo || link.tipo,
      })) || [];
    },
    
    // ✅ CORREGIDO: Filtrar por campos que SÍ existen
    serviciosCount() {
      return this.servicios?.filter(s => s.serv_active === "1" || s.serv_active === 1)?.length || 0;
    },
    
    ofertasCount() {
      return this.ofertas?.filter(o => o.ofertas_id)?.length || 0;
    },
    
    publicacionesCount() {
      return this.publicaciones?.filter(p => p.publicaciones_id)?.length || 0;
    },
    
    // ✅ CORREGIDO: Las gacetas NO tienen "gaceta_estado"
    gacetaCount() {
      return this.gacetas?.filter(g => g.gaceta_id && g.gaceta_documento)?.length || 0;
    },
    
    // ✅ CORREGIDO: Los eventos NO tienen "evento_estado"
    eventosCount() {
      return this.eventos?.filter(e => e.evento_id)?.length || 0;
    },
    
    // ✅ CORREGIDO: Filtrar por video_id (campo que SÍ existe)
    videosCount() {
      return this.videos?.filter(v => v.video_id)?.length || 0;
    },
  },
  
  methods: {
    formatTitle(text) {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    contarConv(tipo) {
      if (!tipo || !this.convocatorias?.length) return 0;
      return this.convocatorias.filter(c => 
        c.tipo_conv_comun?.tipo_conv_comun_titulo === tipo && 
        (c.con_estado === '1' || c.con_estado === 1)
      ).length;
    },
    
    contarCur(tipo) {
      if (!tipo || !this.cursos?.length) return 0;
      return this.cursos.filter(c => 
        c.tipo_curso_otro?.tipo_conv_curso_nombre === tipo && 
        (c.det_estado === '1' || c.det_estado === 1)
      ).length;
    },
    
    clickBack() {
      this.$store.commit("clickLink");
      this.$router.go(-1);
    },
  },
  
};
</script>