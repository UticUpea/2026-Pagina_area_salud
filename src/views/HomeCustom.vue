<template>
  <div class="banner-outer page-title-area bg-overlay-img banner-img">
    <div class="banner-slider">
    </div>
  </div>  
  <!-- ==============================================
    ** About **
    =================================================== -->
  <section class="about">
    <div class="container">
      <ul class="row our-links">
        <li class="col-sm-4 apply-online clearfix equal-hight">
          <div class="icon">
            <img src="@/assets/images/apply-online-ico.png" class="img-responsive" alt="" />
          </div>
          <div class="detail">
            <h3 class="left-aligned">Inscripciones</h3>
            <p class="left-aligned">
              Inscripciones en línea para los estudiantes nuevos y antiguos.
            </p>
            <a href="https://inscripciones.upea.bo          " target="_blank" rel="noopener noreferrer" class="more">
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
          </div>
        </li>
        <li class="col-sm-4 prospects clearfix equal-hight">
          <div class="icon">
            <img src="@/assets/images/prospects-ico.png" class="img-responsive" alt="" />
          </div>
          <div class="detail">
            <h3 class="left-aligned"><span>Descargar</span>Plan de Estudios</h3>
            <a class="more" :href="imageUrl + institucionData.institucion_organigrama" target="_blank" rel="noopener noreferrer">
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
          </div>
        </li>
        <li class="col-sm-4 certification clearfix equal-hight">
          <div class="icon">
            <img src="@/assets/images/certification-ico.png" class="img-responsive" alt="" />
          </div>
          <div class="detail">
            <h3 class="left-aligned">Campus virtual</h3>
            <p class="left-aligned">
              Formación en línea de los estudiantes de la carrera de
              {{ formatNombreCarrera(institucionData.institucion_nombre) }}.
            </p>
            <a href="https://virtualmedicina.upea.bo          " target="_blank" rel="noopener noreferrer" class="more">
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
          </div>
        </li>
      </ul>
    </div>
    <div class="container">
      <div class="row">
        <div class="about-col-right left-aligned col-sm-7 col-sm-push-5 left-block">
          <span class="sm-head">UNIVERSIDAD PÚBLICA DE EL ALTO - CARRERA DE {{ formatNombreCarrera(institucionData.institucion_nombre) }}</span>
          <p class="left-aligned" v-html="institucionData.institucion_mision || institucionData.institucion_objetivos"></p>
          <div class="know-more-wrapper">
            <router-link to="/about" class="know-more">Leer más sobre la carrera
              <span class="icon-more-icon"></span>
            </router-link>
          </div>
        </div>

        <div class="col-sm-5 col-sm-pull-7">
          <iframe v-if="institucionData.institucion_link_video_vision" 
            :src="institucionData.institucion_link_video_vision" 
            frameborder="0" style="width: 100%; min-height: 400px"
            allowfullscreen="allowfullscreen"></iframe>
        </div>
      </div>
    </div>
  </section>
  <!-- ==============================================
    ** VISION - MISION **
    =================================================== -->
  <section class="our-impotance mission-vision-section">
    <div class="container-fluid"> <!-- ✅ Cambiado a container-fluid para más ancho -->
      <div class="row">
        <div class="col-md-6 col-lg-6"> <!-- ✅ Columnas más amplias -->
          <div class="our_solution_category">
            <div class="solution_cards_box">
              <div class="solution_card">
                <div class="hover_color_bubble"></div>
                <div class="solu_title">
                  <h3>Misión</h3>
                  <br>
                </div>
                <div class="solu_description">
                  <p class="left-aligned" v-html="institucionData.institucion_mision"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-6"> <!-- ✅ Columnas más amplias -->
          <div class="our_solution_category">
            <div class="solution_cards_box">
              <div class="solution_card">
                <div class="hover_color_bubble"></div>
                <div class="solu_title">
                  <h3>Visión</h3>
                  <br>
                </div>
                <div class="solu_description">
                  <p class="left-aligned" v-html="institucionData.institucion_vision"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- ==============================================
    ** PUBLICACIONES DE LA GACETA **
    =================================================== -->
  <section class="our-cources padding-lg">
    <div class="container">
      <h2><span>DOCUMENTOS EXISTENTES EN LA </span> GACETA DE LA CARRERA</h2>
      <div v-if="gacetasList.length === 0">
        <h2>SIN GACETA</h2>
      </div>

      <carousel class="row" :items-to-show="4" :items-to-slide="1" :breakpoints="carouselBreakpoints" :autoplay="5000"
        :wrap-around="true">
        <slide v-for="(gac, id_gac) of gacetasList" :key="gac.gaceta_id || id_gac" class="col-sm-4">
          <div class="card">
            <div class="card-image">
              <vue-pdf-embed :source="imageUrl + gac.gaceta_documento" :page="1" :disableTextLayer="true" />
            </div>
            <router-link :to="'/detalleGaceta/' + gac.gaceta_id" @click="$store.commit('clickLink')" class="heading">
              {{ gac.gaceta_titulo }}
            </router-link>
          </div>
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </div>
  </section>

  <!-- ==============================================
    ** MENU **
    =================================================== -->
  <section class="our-impotance padding-lg">
    <div class="container center-content">
      <ul class="row menu-grid">
        <router-link class="col-lg-4 col-md-6 col-sm-12 equal-hight" to="/publicaciones">
          <div class="card2">
            <div class="inner">
              <img src="@/assets/images/easy-access-ico.jpg" alt="Easy To Access" />
              <p>PUBLICACIONES</p>
              <h3>{{ publicacionesCount }}</h3>
            </div>
          </div>
        </router-link>

        <router-link class="col-lg-4 col-md-6 col-sm-12 equal-hight" to="/gaceta">
          <div class="card2">
            <div class="inner">
              <img src="@/assets/images/study-go-ico.jpg" alt="Study on the Go" />
              <p>GACETA</p>
              <h3>{{ gacetasCount }}</h3>
            </div>
          </div>
        </router-link>

        <router-link class="col-lg-4 col-md-6 col-sm-12 equal-hight" to="/eventos">
          <div class="card2">
            <div class="inner">
              <img src="@/assets/images/get-innovative-ico.jpg" alt="Get an Innovative, In-depth Transition" />
              <p>EVENTOS</p>
              <h3>{{ eventosCount }}</h3>
            </div>
          </div>
          <br />
        </router-link>

        <router-link class="col-lg-4 col-md-6 col-sm-12 equal-hight" to="/videos">
          <div class="card2">
            <div class="inner">
              <img src="@/assets/images/practical-ico.jpg" alt="Practical & Interactive Participation" />
              <p>VIDEOS</p>
              <h3>{{ videosCount }}</h3>
            </div>
          </div>
        </router-link>

        <router-link class="col-lg-4 col-md-6 col-sm-12 equal-hight" to="/servicios">
          <div class="card2">
            <div class="inner">
              <img src="@/assets/images/practical-ico.jpg" alt="Practical & Interactive Participation" />
              <p>SERVICIOS</p>
              <h3>{{ serviciosCount }}</h3>
            </div>
          </div>
        </router-link>

        <router-link class="col-lg-4 col-md-6 col-sm-12 equal-hight" to="/ofertas">
          <div class="card2">
            <div class="inner">
              <img src="@/assets/images/practical-ico.jpg" alt="Practical & Interactive Participation" />
              <p>OFERTAS ACADÉMICAS</p>
              <h3>{{ ofertasCount }}</h3>
            </div>
          </div>
        </router-link>

        <router-link class="col-lg-4 col-md-6 col-sm-12 equal-hight" v-for="(conv, id_conv) of MenuConv" :key="conv.idtipo_conv_comun || id_conv"
          :to="'/convocatorias/' + conv.idtipo_conv_comun" @click="$store.commit('clickLink')">
          <br />
          <div class="card2">
            <div class="inner">
              <img src="@/assets/images/study-time-ico.jpg" alt="Malleable Study Time" />
              <p>{{ conv.tipo_conv_comun_titulo }}</p>
              <h3>{{ contarConv(conv.tipo_conv_comun_titulo) }}</h3>
            </div>
          </div>
          <br />
        </router-link>

        <router-link class="col-lg-4 col-md-6 col-sm-12 equal-hight" v-for="(cur, id_cur) of MenuCur" :key="cur.idtipo_curso_otros || id_cur"
          :to="'/cursos/' + cur.idtipo_curso_otros" @click="$store.commit('clickLink')">
          <div class="card2">
            <div class="inner">
              <img src="@/assets/images/placement-ico.jpg" alt="Placement Assistance" />
              <p>{{ cur.tipo_conv_curso_nombre }}</p>
              <h3>{{ contarCur(cur.tipo_conv_curso_nombre) }}</h3>
            </div>
          </div>
          <br />
        </router-link>
      </ul>
    </div>
  </section>

  <!-- ==============================================
    ** NOVEDADES **
    =================================================== -->
  <section class="why-choose padding-lg">
    <div class="container">
      <h2><span>Convocatorias, comunicados, avisos</span>Lo más reciente</h2>

      <carousel v-if="itemsToShow > 0" :items-to-slide="1" :breakpoints="carouselBreakpoints1"
        :items-to-show="itemsToShow" :autoplay="5000" :wrap-around="true">
        
        <slide v-if="latestConv?.con_titulo">
          <div class="card3">
            <div class="card3-image">
              <router-link :to="'/convocatorias/' + latestConv?.tipo_conv_comun?.idtipo_conv_comun">
                <div class="save">
                  {{ latestConv?.tipo_conv_comun?.tipo_conv_comun_titulo }}
                </div>
              </router-link>
              <img style="width: 300px; height: 220px" :src="imageUrl + latestConv?.con_foto_portada"
                alt="img" class="img-responsive" />
            </div>
            <p class="card3-title">
              <router-link :to="'/detalleConvocatoria/' + latestConv?.idconvocatorias">{{ latestConv?.con_titulo }}</router-link>
            </p>
            <p class="footer3">
              Fecha:
              <span class="date">{{ formatearFecha(latestConv?.con_fecha_inicio) }}</span>
            </p>
          </div>
        </slide>

        <slide v-if="latestComun?.con_titulo">
          <div class="card3">
            <div class="card3-image">
              <router-link :to="'/convocatorias/' + latestComun?.tipo_conv_comun?.idtipo_conv_comun">
                <div class="save">
                  {{ latestComun?.tipo_conv_comun?.tipo_conv_comun_titulo }}
                </div>
              </router-link>
              <img style="width: 300px; height: 220px" :src="imageUrl + latestComun?.con_foto_portada"
                class="img-responsive" />
            </div>
            <p class="card3-title">
              <router-link :to="'/detalleConvocatoria/' + latestComun?.idconvocatorias" class="plus-icon">{{ latestComun?.con_titulo }}</router-link>
            </p>
            <p class="footer3">
              Fecha:
              <span class="date">{{ formatearFecha(latestComun?.con_fecha_inicio) }}</span>
            </p>
          </div>
        </slide>

        <slide v-if="latestAv?.con_titulo">
          <div class="card3">
            <div class="card3-image">
              <router-link :to="'/convocatorias/' + latestAv?.tipo_conv_comun?.idtipo_conv_comun">
                <div class="save">
                  {{ latestAv?.tipo_conv_comun?.tipo_conv_comun_titulo }}
                </div>
              </router-link>
              <img style="width: 300px; height: 220px" :src="imageUrl + latestAv?.con_foto_portada"
                class="img-responsive" />
            </div>
            <p class="card3-title">
              <router-link :to="'/detalleConvocatoria/' + latestAv?.idconvocatorias">{{ latestAv?.con_titulo }}</router-link>
            </p>
            <p class="footer3">
              Fecha:
              <span class="date">{{ formatearFecha(latestAv?.con_fecha_inicio) }}</span>
            </p>
          </div>
        </slide>

        <slide v-if="latestCur?.det_titulo">
          <div class="card3">
            <div class="card3-image">
              <router-link :to="'/cursos/' + latestCur?.idtipo_curso_otros">
                <div class="save">
                  {{ latestCur?.tipo_curso_otro?.tipo_conv_curso_nombre }}
                </div>
              </router-link>
              <img style="width: 300px; height: 220px" :src="imageUrl + latestCur?.det_img_portada"
                class="img-responsive" />
            </div>
            <p class="card3-title">
              <router-link :to="'/detalleCurso/' + latestCur?.iddetalle_cursos_academicos">
                {{ latestCur?.det_titulo }}
              </router-link>
            </p>
            <p class="footer3">
              Fecha:
              <span class="date">{{ formatearFecha(latestCur?.det_fecha_ini) }}</span>
            </p>
          </div>
        </slide>

        <slide v-if="latestSem?.det_titulo">
          <div class="card3">
            <div class="card3-image">
              <router-link :to="'/cursos/' + latestSem?.idtipo_curso_otros">
                <div class="save">
                  {{ latestSem?.tipo_curso_otro?.tipo_conv_curso_nombre }}
                </div>
              </router-link>
              <img style="width: 300px; height: 220px" :src="imageUrl + latestSem?.det_img_portada"
                class="img-responsive" />
            </div>
            <p class="card3-title">
              <router-link :to="'/detalleCurso/' + latestSem?.iddetalle_cursos_academicos">
                {{ latestSem?.det_titulo }}
              </router-link>
            </p>
            <p class="footer3">
              Fecha:
              <span class="date">{{ formatearFecha(latestSem?.det_fecha_ini) }}</span>
            </p>
          </div>
        </slide>

        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </div>
  </section>

  <!-- ==============================================
    ** AUTORIDADES **
    =================================================== -->
  <section class="browse-teacher grey-bg padding-lg">
    <div class="container">
      <h2>
        <span>AUTORIDADES DE LA CARRERA DE {{ institucionData.institucion_nombre }}</span>
        Nuestras Autoridades
      </h2>
      <ul class="row browse-teachers-list clearfix">
        <li class="col-12 col-md-4" v-for="(autoridad, id_aut) of autoridadesList" :key="autoridad.id_autoridad || id_aut" 
          v-show="(pag - 1) * NUM_RESULTS <= id_aut && pag * NUM_RESULTS > id_aut">
          <figure>
            <img :src="imageUrl + autoridad.foto_autoridad" width="123" height="124" alt="" />
          </figure>
          <h3>{{ autoridad.nombre_autoridad }}</h3>
          <span class="designation">{{ autoridad.cargo_autoridad }}</span>
          <ul class="teachers-follow">
            <li v-if="autoridad.facebook_autoridad && autoridad.facebook_autoridad !== '_'">
              <a :href="autoridad.facebook_autoridad?.trim()" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-facebook" aria-hidden="true"></i>
              </a>
            </li>
            <li v-if="autoridad.twiter_autoridad && autoridad.twiter_autoridad !== '_'">
              <a :href="autoridad.twiter_autoridad?.trim()" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-twitter" aria-hidden="true"></i>
              </a>
            </li>
            <li v-if="autoridad.celular_autoridad">
              <a :href="'https://wa.me/+591          ' + String(autoridad.celular_autoridad).replace(/[^0-9]/g, '')" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fa fa-whatsapp" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>

  <div>
    <div class="whatsapp-button">
      <a :href="'https://wa.me/+591          ' + (institucionData.institucion_celular1?.toString().replace(/[^0-9]/g, '') || '')" 
         target="_blank" 
         rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
          <path fill="#00E676" d="M10.7 32.8l.6.3c2.5 1.5 5.3 2.2 8.1 2.2 8.8 0 16-7.2 16-16 0-4.2-1.7-8.3-4.7-11.3s-7-4.7-11.3-4.7c-8.8 0-16 7.2-15.9 16.1 0 3 .9 5.9 2.4 8.4l.4.6-1.6 5.9 6-1.5z"></path>
          <path fill="#FFF" d="M32.4 6.4C29 2.9 24.3 1 19.5 1 9.3 1 1.1 9.3 1.2 19.4c0 3.2.9 6.3 2.4 9.1L1 38l9.7-2.5c2.7 1.5 5.7 2.2 8.7 2.2 10.1 0 18.3-8.3 18.3-18.4 0-4.9-1.9-9.5-5.3-12.9zM19.5 34.6c-2.7 0-5.4-.7-7.7-2.1l-.6-.3-5.8 1.5L6.9 28l-.4-.6c-4.4-7.1-2.3-16.5 4.9-20.9s16.5-2.3 20.9 4.9 2.3 16.5-4.9 20.9c-2.3 1.5-5.1 2.3-7.9 2.3zm8.8-11.1l-1.1-.5s-1.6-.7-2.6-1.2c-.1 0-.2-.1-.3-.1-.3 0-.5.1-.7.2 0 0-.1.1-1.5 1.7-.1.2-.3.3-.5.3h-.1c-.1 0-.3-.1-.4-.2l-.5-.2c-1.1-.5-2.1-1.1-2.9-1.9-.2-.2-.5-.4-.7-.6-.7-.7-1.4-1.5-1.9-2.4l-.1-.2c-.1-.1-.1-.2-.2-.4 0-.2 0-.4.1-.5 0 0 .4-.5.7-.8.2-.2.3-.5.5-.7.2-.3.3-.7.2-1-.1-.5-1.3-3.2-1.6-3.8-.2-.3-.4-.4-.7-.5h-1.1c-.2 0-.4.1-.6.1l-.1.1c-.2.1-.4.3-.6.4-.2.2-.3.4-.5.6-.7.9-1.1 2-1.1 3.1 0 .8.2 1.6.5 2.3l.1.3c.9 1.9 2.1 3.6 3.7 5.1l.4.4c.3.3.6.5.8.8 2.1 1.8 4.5 3.1 7.2 3.8.3.1.7.1 1 .2h1c.5 0 1.1-.2 1.5-.4.3-.2.5-.2.7-.4l.2-.2c.2-.2.4-.3.6-.5s.4-.4.5-.6c.2-.4.3-.9.4-1.4v-.7s-.1-.1-.3-.2z"></path>
        </svg>
      </a>
    </div>
  </div>

</template>

<style scoped>
.whatsapp-button {
  position: fixed;
  bottom: 55px;
  right: 20px;
  z-index: 999;
}
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* =========================================
   MENU CENTRADO - RESPONSIVE
   ========================================= */
.menu-grid {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  align-items: center !important;
  margin: 0 auto !important;
  padding: 0 !important;
  list-style: none !important;
  width: 100% !important;
  max-width: 1200px !important;
}

/* Desktop - 3 columnas centradas */
@media (min-width: 992px) {
  .menu-grid > router-link,
  .menu-grid > a {
    flex: 0 0 auto !important;
    width: 280px !important;
    max-width: 280px !important;
    margin: 15px !important;
    display: inline-block !important;
  }
}

/* Tablet - 2 columnas centradas */
@media (min-width: 768px) and (max-width: 991px) {
  .menu-grid > router-link,
  .menu-grid > a {
    flex: 0 0 auto !important;
    width: 280px !important;
    max-width: 280px !important;
    margin: 15px !important;
    display: inline-block !important;
  }
}

/* Móvil - 1 columna centrada */
@media (max-width: 767px) {
  .menu-grid > router-link,
  .menu-grid > a {
    flex: 0 0 auto !important;
    width: 280px !important;
    max-width: 280px !important;
    margin: 15px auto !important;
    display: block !important;
  }
}

/* Ocultar los <br> */
.menu-grid br {
  display: none !important;
}

/* =========================================
   MISIÓN Y VISIÓN - SECCIÓN AMPLIADA
   ========================================= */
.mission-vision-section {
  padding: 60px 0;
  background: #f8f9fa;
}

.mission-vision-section .container-fluid {
  max-width: 1400px; /* ✅ Ancho máximo más amplio */
  margin: 0 auto;
  padding: 0 30px; /* ✅ Más padding lateral */
}

.mission-vision-section .col-md-6 {
  padding: 20px; /* ✅ Espacio entre columnas */
}

.section_our_solution .row {
  align-items: center;
}
.our_solution_category {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.our_solution_category .solution_cards_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.solution_cards_box .solution_card {
  flex: 0 50%;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(185, 186, 194, 0.2),
    0 5px 15px 0 rgba(90, 91, 99, 0.15);
  border-radius: 15px;
  padding: 40px 45px; /* ✅ Más padding interno */
  position: relative;
  z-index: 1;
  overflow: visible;
  min-height: auto;
  height: auto;
  transition: 0.7s;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}

.solution_cards_box .solution_card:hover {
  background: var(--main-color);
  color: #fff;
  transform: scale(1.1);
  z-index: 10;
  pointer-events: auto;
}

.solution_cards_box .solution_card:hover::before {
  background: rgba(183, 187, 204, 0.1);
}

.solution_cards_box .solution_card:hover .solu_title h3,
.solution_cards_box .solution_card:hover .solu_description p {
  color: #fff;
}

.solution_cards_box .solution_card:before {
  content: "";
  position: absolute;
  background: rgba(98, 99, 102, 0.05);
  width: 100%;
  height: 100%;
  z-index: -1;
  transform: rotate(42deg);
  right: -56px;
  top: -23px;
  border-radius: 35px;
}

.solution_cards_box .solution_card:hover .solu_description button {
  background: #fff !important;
  color: #e2c3c3;
}

.solution_card .solu_title {
  position: relative;
  z-index: 1;
}

.solution_card .solu_title div {
  color: #212121;
  font-size: 1.3rem;
  margin-top: 13px;
  margin-bottom: 13px;
}

.solution_card .solu_title h3 {
  font-size: 32px; /* ✅ Título más grande */
  margin-bottom: 25px;
  word-wrap: break-word;
  font-weight: 700;
}

.solution_card .solu_description {
  flex: 1;
  overflow: visible;
  position: relative;
  z-index: 1;
}

.solution_card .solu_description p {
  font-size: 16px; /* ✅ Texto más grande */
  margin-bottom: 15px;
  line-height: 1.8; /* ✅ Más espacio entre líneas */
  overflow: visible;
  word-wrap: break-word;
  hyphens: auto;
  text-align: justify;
}

.solution_card .solu_description button {
  border: 0;
  border-radius: 15px;
  background: linear-gradient(140deg, #ca4242 0%, #ca4242 50%, #ca4242c7 75%) !important;
  color: #fff;
  font-weight: 500;
  font-size: 1rem;
  padding: 5px 16px;
}

/* =========================================
   BURBUJAS DINÁMICAS - DENTRO DEL CUADRO
   ========================================= */
.hover_color_bubble {
  position: absolute;
  background: rgba(143, 148, 172, 0.15);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  top: -50px;
  right: -50px;
  z-index: 0;
  transition: 0.7s;
  pointer-events: none;
}

.solution_cards_box .solution_card:hover .hover_color_bubble {
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  opacity: 0.3;
}

.solution_cards_box .solution_card .so_top_icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.solution_cards_box .solution_card .so_top_icon img {
  width: 40px;
  height: 50px;
  object-fit: contain;
}

/* Responsive para tarjetas Misión/Visión */
@media (max-width: 768px) {
  .mission-vision-section .container-fluid {
    padding: 0 15px;
  }
  
  .mission-vision-section .col-md-6 {
    padding: 10px;
  }
  
  .solution_cards_box .solution_card {
    padding: 30px 25px;
    min-height: auto;
    margin-bottom: 30px;
  }
  
  .solution_card .solu_title h3 {
    font-size: 28px;
  }
  
  .solution_card .solu_description p {
    font-size: 15px;
    line-height: 1.6;
    text-align: left;
  }
  
  .hover_color_bubble {
    width: 150px;
    height: 150px;
  }
}

@media screen and (min-width: 320px) {
  .sol_card_top_3 { position: relative; top: 0; }
  .our_solution_category { width: 100%; margin: 8px auto; }
  .our_solution_category .solution_cards_box { flex: auto; }
}
@media only screen and (min-width: 768px) {
  .our_solution_category .solution_cards_box { flex: 1; }
}
@media only screen and (min-width: 1024px) {
  .sol_card_top_3 { position: relative; top: -3rem; }
  .our_solution_category { width: 80%; margin: 8px auto; }
}

/* =========================================
   TARJETAS DEL MENÚ (card2)
   ========================================= */
.card {
  width: 250px;
  background: white;
  padding: 0.4em;
  border-radius: 6px;
}
.card-image {
  background-color: rgb(236, 236, 236);
  width: 100%;
  border-radius: 6px 6px 0 0;
}
.heading {
  font-weight: 600;
  color: rgb(88, 87, 87);
}
.heading:hover { cursor: pointer; }

.card2 {
  box-sizing: border-box;
  width: 190px;
  height: 254px;
  background: rgba(217, 217, 217, 0.58);
  border: 1px solid white;
  box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  border-radius: 17px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-weight: bolder;
  color: black;
  position: relative;
  z-index: 100;
  pointer-events: auto;
}

.card2:hover {
  border: 1px solid var(--main-color);
  transform: scale(1.05);
}

.card2:active {
  transform: scale(0.95) rotateZ(1.7deg);
}

/* =========================================
   TARJETAS NOVEDADES (card3)
   ========================================= */
.card3 {
  padding: 20px;
  width: 330px;
  min-height: 370px;
  border-radius: 20px;
  background: #cecece;
  transition: 0.4s;
}
.card3:hover { translate: 0 -10px; }
.card3-title {
  font-size: 18px;
  font-weight: 600;
  color: #b2eccf;
  margin: 15px 0 0 10px;
}
.card3-image {
  min-height: 170px;
  background-color: #797979;
  border-radius: 15px;
  background: #797979;
}
.card3-body {
  margin: 13px 0 0 10px;
  color: rgb(184, 184, 184);
  font-size: 15px;
}
.footer3 {
  float: right;
  margin: 28px 0 0 18px;
  font-size: 13px;
  color: var(--main-color-2);
}
.save {
  position: absolute;
  transition: 0.2s ease-in-out;
  border-radius: 6px;
  margin: 5px;
  padding: 5px;
  background-color: var(--main-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
}
.save:hover {
  transform: scale(1.1) rotate(10deg);
}
.save router-link {
  color: #fff;
  text-decoration: none;
}

/* =========================================
   SECCIÓN ABOUT - 3 CUADROS SUPERIORES
   ========================================= */
.cat-area a {
  height: 28px;
  line-height: 28px;
  padding: 0 18px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-right: -9px;
}
.cat-area a.cat-yellow { background: #eeb600; }
.about-col-right p {
  max-height: 300px;
  overflow: auto;
}

.our-links {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}

.our-links > li {
  display: flex;
  flex-direction: column;
  height: 180px;
  overflow: hidden;
}

.our-links .detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.our-links .detail p {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.about {
  display: block;
  position: relative;
  padding: 222px 0 100px 0;
  background: #f8f9fa;
}

.about ul.our-links {
  display: block;
  margin: -280px 0 0 0;
  position: relative;
  z-index: 99;
}

.about ul.our-links li {
  display: block;
  position: relative;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.about ul.our-links li:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.about ul.our-links li.apply-online {
  background: var(--main-color-3);
  color: #fff;
}

.about ul.our-links li.prospects {
  background: var(--main-color-2);
  color: #fff;
}

.about ul.our-links li.certification {
  background: #f0bc01;
  color: #fff;
}

.about ul.our-links li .icon {
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
}

.about ul.our-links li .icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.about ul.our-links li .detail {
  color: #fff;
}

.about ul.our-links li .detail h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #fff;
}

.about ul.our-links li .detail p {
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 20px;
}

.about ul.our-links li .detail a.more {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 36px;
  background: #fff;
  border-radius: 50%;
  text-align: center;
  font-size: 18px;
  color: var(--main-color-3);
  transition: all 0.3s ease;
}

.about ul.our-links li .detail a.more:hover {
  transform: scale(1.1);
  background: var(--main-color-3);
  color: #fff;
}

/* =========================================
   Z-INDEX GLOBAL PARA EVITAR CONFLICTOS
   ========================================= */
.our-impotance > .container {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.our-impotance.padding-lg {
  position: relative;
  z-index: 5;
}

</style>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { mapState } from "vuex";
import VuePdfEmbed from "vue-pdf-embed";
import api from '@/plugins/axios';

export default {
  name: "HomeCustom",
  
  data() {
    return {
      idInstitucion: process.env.VUE_APP_ID_INSTITUCION || '9',
      institucionLocal: {},
      convocatoriasLocal: [],
      cursosLocal: [],
      eventosLocal: [],
      serviciosLocal: [],
      ofertasLocal: [],
      gacetasLocal: [],
      publicacionesLocal: [],
      videosLocal: [],
      autoridadesLocal: [],
      
      NUM_RESULTS: 3,
      pag: 1,
      pager: 0,

      carouselBreakpoints: {
        768: { itemsToShow: 4 },
        576: { itemsToShow: 2 },
        360: { itemsToShow: 1 },
      },
      carouselBreakpoints1: {
        768: { itemsToShow: 2 },
        576: { itemsToShow: 1 },
        360: { itemsToShow: 1 },
      },
    };
  },

  computed: {
    ...mapState([
      "url_api", "MenuConv", "MenuCur", "Links", "Institucion",
      "convocatorias", "cursos", "eventos", "servicios", "ofertas",
      "gacetas", "publicaciones", "videos", "autoridades"
    ]),
    
    institucionData() {
      const vuexData = this.Institucion?.Descripcion || this.Institucion;
      if (vuexData && Object.keys(vuexData).length > 0) return vuexData;
      return this.institucionLocal?.Descripcion || this.institucionLocal;
    },
    
    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo          ').trim();
    },
    
    convocatoriasList() { return this.convocatorias?.length ? this.convocatorias : this.convocatoriasLocal; },
    cursosList() { return this.cursos?.length ? this.cursos : this.cursosLocal; },
    eventosList() { return this.eventos?.length ? this.eventos : this.eventosLocal; },
    serviciosList() { return this.servicios?.length ? this.servicios : this.serviciosLocal; },
    ofertasList() { return this.ofertas?.length ? this.ofertas : this.ofertasLocal; },
    gacetasList() { return this.gacetas?.length ? this.gacetas : this.gacetasLocal; },
    publicacionesList() { return this.publicaciones?.length ? this.publicaciones : this.publicacionesLocal; },
    videosList() { return this.videos?.length ? this.videos : this.videosLocal; },
    autoridadesList() { return this.autoridades?.length ? this.autoridades : this.autoridadesLocal; },
    
    serviciosCount() { return this.serviciosList?.filter(s => s.serv_active === "1")?.length || 0; },
    ofertasCount() { return this.ofertasList?.length || 0; },
    publicacionesCount() { return this.publicacionesList?.length || 0; },
    gacetasCount() { return this.gacetasList?.filter(g => g.gaceta_id && g.gaceta_documento)?.length || 0; },
    eventosCount() { return this.eventosList?.filter(e => e.evento_id)?.length || 0; },
    videosCount() { return this.videosList?.filter(v => v.video_estado === 1)?.length || 0; },
    
    latestConv() {
      const list = this.convocatoriasList;
      return list?.find(c => c.tipo_conv_comun?.tipo_conv_comun_titulo === 'CONVOCATORIAS' && c.con_estado === '1') || {};
    },
    latestComun() {
      const list = this.convocatoriasList;
      return list?.find(c => c.tipo_conv_comun?.tipo_conv_comun_titulo === 'COMUNICADOS' && c.con_estado === '1') || {};
    },
    latestAv() {
      const list = this.convocatoriasList;
      return list?.find(c => c.tipo_conv_comun?.tipo_conv_comun_titulo === 'AVISOS' && c.con_estado === '1') || {};
    },
    latestCur() {
      const list = this.cursosList;
      return list?.find(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === 'CURSOS' && c.det_estado === '1') || {};
    },
    latestSem() {
      const list = this.cursosList;
      return list?.find(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === 'SEMINARIOS' && c.det_estado === '1') || {};
    },
    
    itemsToShow() {
      const availableItems = [
        this.latestConv?.con_titulo ? 1 : 0,
        this.latestComun?.con_titulo ? 1 : 0,
        this.latestAv?.con_titulo ? 1 : 0,
        this.latestCur?.det_titulo ? 1 : 0,
        this.latestSem?.det_titulo ? 1 : 0,
      ];
      const maxItems = Math.max(...availableItems);
      return maxItems > 0 ? 1 : 0;
    },
  },

  components: {
    VuePdfEmbed,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },

  methods: {
    async getContenidosGacetaEventos() {
      try {
        const res = await api.get(`/institucion/${this.idInstitucion}/gacetaEventos`);
        const data = res.data;
        this.convocatoriasLocal = data.convocatorias?.map(this._limpiar) || [];
        this.cursosLocal = data.cursos?.map(this._limpiar) || [];
        this.eventosLocal = data.upea_evento?.map(this._limpiar) || [];
        this.serviciosLocal = data.serviciosCarrera?.map(this._limpiar) || [];
        this.ofertasLocal = data.ofertasAcademicas?.map(this._limpiar) || [];
        this.gacetasLocal = (data.upea_gaceta_universitaria || [])
          .filter(g => g.gaceta_estado === "1")
          .map(this._limpiar);

        this._actualizarPager();
        
      } catch (error) {
        console.error('Error cargando gacetaEventos:', error);
      }
    },

    async getRecursos() {
      try {
        const res = await api.get(`/institucion/${this.idInstitucion}/recursos`);
        const data = res.data;
        
        this.publicacionesLocal = data.upea_publicaciones?.map(this._limpiar) || [];

        if (data.linksExternoInterno && !this.Links?.length) {
          const enlaces = data.linksExternoInterno.filter(l => l.estado === 1);
          this.$store.commit('setLinks', enlaces);
        }
      } catch (error) {
        console.error('Error cargando recursos:', error);
      }
    },

    async getContenidoExtra() {
      try {
        const res = await api.get(`/institucion/${this.idInstitucion}/contenido`);
        const data = res.data;
        
        this.autoridadesLocal = data.autoridad?.map(this._limpiar) || [];
        this.videosLocal = data.upea_videos?.map(this._limpiar) || [];
      } catch (error) {
        console.error('Error cargando contenido extra:', error);
      }
    },

    async getInstitucion() {
      try {
        const res = await api.get(`/institucionesPrincipal/${this.idInstitucion}`);
        const institucionData = res.data.Descripcion || res.data;

        this.$store.commit('setInstitucion', institucionData);
        this.institucionLocal = institucionData;
        
      } catch (error) {
        console.error('Error cargando institución:', error);
      }
    },
    _actualizarPager() {
      const total = this.autoridadesList?.length || 0;
      this.pager = Math.ceil(total / this.NUM_RESULTS);
      if (this.pag > this.pager && this.pager > 0) this.pag = this.pager;
    },

    _limpiar(obj) {
      if (!obj || typeof obj !== 'object') return obj;
      const cleaned = { ...obj };
      Object.keys(cleaned).forEach(key => {
        if (typeof cleaned[key] === 'string') {
          cleaned[key] = cleaned[key].trim();
        } else if (cleaned[key] && typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
          cleaned[key] = this._limpiar(cleaned[key]);
        }
      });
      return cleaned;
    },

    formatearFecha(fechaISO) {
      if (!fechaISO) return '';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },

    contarConv(tipo) {
      if (!tipo) return 0;
      return this.convocatoriasList.filter(c => 
        c.tipo_conv_comun?.tipo_conv_comun_titulo === tipo && c.con_estado === '1'
      ).length;
    },
    
    contarCur(tipo) {
      if (!tipo) return 0;
      return this.cursosList.filter(c => 
        c.tipo_curso_otro?.tipo_conv_curso_nombre === tipo && c.det_estado === '1'
      ).length;
    },

    formatNombreCarrera(nombre) {
      if (!nombre) return "";
      return nombre.split(" ").map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
    },

    blockRighClick(event) {
      event.preventDefault();
    },
    
     updateCssVariables() {
    const colorList = this.Institucion?.colorinstitucion || [];
    const colors = colorList[0];
    
    if (colors && colors.color_primario) {
      // Actualiza las variables CSS en :root
      document.documentElement.style.setProperty('--main-color', colors.color_primario);
      
      // Si tienes más colores en la API, actualízalos también:
      if (colors.color_secundario) {
        document.documentElement.style.setProperty('--main-color-2', colors.color_secundario);
      }
      if (colors.color_terciario) {
        document.documentElement.style.setProperty('--main-color-3', colors.color_terciario);
      }
      
    }
  },
  },

  created() {
    this.$store.commit("loadOn");

    Promise.all([
      this.getInstitucion(),
      this.getContenidosGacetaEventos(),
      this.getRecursos(),
      this.getContenidoExtra()
    ]).then(() => {
      this.$store.commit("loading"); 
    }).catch(err => {
      console.error('Error cargando datos:', err);
      this.$store.commit("loading");
    });
  },

  mounted() {
    document.body.addEventListener('contextmenu', this.blockRighClick);
    this.$nextTick(() => {
    this.updateCssVariables();
    
  });
  },
  
  
  beforeUnmount() {
    document.body.removeEventListener('contextmenu', this.blockRighClick);
  },

  watch: {
  // Re-actualizar cuando cambie la institución
  Institucion: {
    handler() {
      this.$nextTick(() => {
        this.updateCssVariables();
      });
    },
    deep: true,
    immediate: true
  }
}


};

</script>