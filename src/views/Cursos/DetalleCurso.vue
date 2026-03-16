<template>
  <div class="inner-banner">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-lg-9">
          <div class="content">
            <h1>{{ cursoData?.det_titulo || 'Curso' }}</h1>
            <h4>
              <router-link to="/">INICIO</router-link>
            </h4>
            <h5>
              <a style="cursor: pointer" @click="clickBack()">
                {{ cursoData?.tipo_curso_otro?.tipo_conv_curso_nombre || 'Cursos' }}
              </a>
            </h5>
            <h3 v-if="cursoData?.det_titulo">{{ cursoData.det_titulo }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Course Description **
    =================================================== -->
  <section class="about inner padding-lg" v-if="cursoData">
    <div class="container">
      <div class="row">
        <div class="col-md-7 col-md-push-5 left-block">
          <h2>Fechas y Horarios</h2>
          <div class="row">
            <div class="col-4 align-self-center">
              <h6>{{ formatearFecha(cursoData.det_fecha_ini) }}</h6>
              <span>Fecha inicio</span>
            </div>
            <div class="col-4 align-self-center">
              <h6>{{ formatearFecha(cursoData.det_fecha_fin) }}</h6>
              <span>Fecha fin</span>
            </div>
            <div class="col-4 align-self-center">
              <h6>{{ cursoData.det_hora_ini || 'Por definir' }}</h6>
              <span>Hora inicio</span>
            </div>
          </div>
        </div>
        <div class="col-md-5 col-md-pull-7">
          <div class="enquire-wrapper">
            <figure class="hidden-xs hidden-sm">
              <div 
                class="image-zoom-container"
                @click="openImageModal"
              >
                <img 
                  :src="imageUrl + cursoData.det_img_portada" 
                  :alt="cursoData.det_titulo || 'Imagen del curso'"
                  class="img-responsive preview-image"
                />
                <span class="zoom-overlay">
                  <i class="fa fa-search-plus"></i> Click para ampliar
                </span>
              </div>
            </figure>
            <div class="enquire-now"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==============================================
    ** Course Details Tab **
    =================================================== -->
  <section class="details-tab" v-if="cursoData">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="bs-example bs-example-tabs" data-example-id="togglable-tabs">
            <ul class="nav nav-tabs course-tab" id="myTabs" role="tablist">
              <li role="presentation">
                <a href="#schedule" role="tab" id="schedule-tab" data-toggle="tab" aria-controls="schedule" aria-expanded="false">
                  <span class="icon-schedule-icon"></span>
                  <div class="block">COSTO</div>
                </a>
              </li>
              <li role="presentation">
                <a href="#semester" role="tab" id="semester-tab" data-toggle="tab" aria-controls="semester" aria-expanded="false">
                  <span class="icon-curriculam-icon"></span>
                  <div class="block">CONTENIDO</div>
                </a>
              </li>
              <li role="presentation">
                <a href="#teachers" role="tab" id="teachers-tab" data-toggle="tab" aria-controls="teachers" aria-expanded="false">
                  <span class="icon-parents-icon"></span>
                  <div class="block">FACILITADORES</div>
                </a>
              </li>
            </ul>
            
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade" role="tabpanel" id="schedule" aria-labelledby="schedule-tab">
                <div class="table-responsive">
                  <table class="table course-table table-bordered">
                    <thead>
                      <tr>
                        <th>PERSONAS</th>
                        <th>MONTO</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><div class="table-col1">Costo para estudiantes de la carrera</div></td>
                        <td><div class="fee-amt">{{ cursoData.det_costo !== undefined ? cursoData.det_costo + ' Bs' : 'N/A' }}</div></td>
                      </tr>
                      <tr>
                        <td><div class="table-col1">Costo para profesionales</div></td>
                        <td><div class="fee-amt">{{ cursoData.det_costo_profe !== undefined ? cursoData.det_costo_profe + ' Bs' : 'N/A' }}</div></td>
                      </tr>
                      <tr>
                        <td><div class="table-col1">Costo para personas externas</div></td>
                        <td><div class="fee-amt">{{ cursoData.det_costo_ext !== undefined ? cursoData.det_costo_ext + ' Bs' : 'N/A' }}</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="tab-pane fade" role="tabpanel" id="semester" aria-labelledby="semester-tab">
                <div class="row">
                  <div class="col-sm-6">
                    <ul class="content">
                      <li>
                        <h4>{{ cursoData.det_titulo }}</h4>
                        <p v-html="cursoData.det_descripcion"></p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="tab-pane fade" role="tabpanel" id="teachers" aria-labelledby="teachers-tab">
                <div class="container">
                  <ul class="row browse-teachers-list clearfix">
                    <li 
                      class="col-12 col-md-4" 
                      v-for="(fac, id_fac) of cursoData.facilitadores" 
                      :key="fac.id_facilitador || id_fac"
                    >
                      <figure>
                        <img 
                          :src="imageUrl + fac.foto_facilitador" 
                          :alt="fac.nombre_facilitador || 'Foto del facilitador'"
                          width="123" 
                          height="124" 
                        />
                      </figure>
                      <h3>{{ fac.nombre_facilitador }}</h3>
                      <span class="designation">{{ fac.cargo_facilitador }}</span>
                      <span class="designation">{{ fac.descripcion_facilitador }}</span>
                      
                      <ul class="teachers-follow">
                        <li v-if="fac.facebook_facilitador?.trim()">
                          <a :href="fac.facebook_facilitador.trim()" target="_blank" rel="noopener noreferrer">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                          </a>
                        </li>
                        <li v-if="fac.twiter_facilitador?.trim()">
                          <a :href="fac.twiter_facilitador.trim()" target="_blank" rel="noopener noreferrer">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                          </a>
                        </li>
                        <li v-if="fac.celular_facilitador">
                          <a :href="'https://wa.me/+591' + String(fac.celular_facilitador).replace(/[^0-9]/g, '')" 
                             target="_blank"
                             rel="noopener noreferrer">
                            <i class="fa fa-whatsapp" aria-hidden="true"></i>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="container blog-wrapper padding-lg" v-else-if="cursoNotFound">
    <div class="row">
      <div class="col-sm-12 text-center py-5">
        <i class="fa fa-graduation-cap text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
        <h2 class="mt-4">Curso no encontrado</h2>
        <p class="text-muted">
          El curso que buscas no está disponible o fue eliminado.
        </p>
        <button @click="clickBack()" class="btn btn-outline mt-3">
          ← Volver a cursos
        </button>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg" v-else>
    <div class="row">
      <div class="col-sm-12 text-center py-5">
        <div class="spinner-border text-muted" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando curso...</p>
      </div>
    </div>
  </div>

  <div 
    v-if="showImageModal" 
    class="image-modal-overlay"
    @click="closeImageModal"
  >
    <div class="image-modal-content" @click.stop>
      <button class="modal-close-btn" @click="closeImageModal">
        <i class="fa fa-times"></i>
      </button>
      <img 
        :src="imageUrl + cursoData.det_img_portada" 
        :alt="cursoData.det_titulo"
        class="modal-image"
      />
      <!-- <div class="modal-caption">{{ cursoData.det_titulo }}</div> -->
    </div>
  </div>
</template>

<style scoped>

.enquire-wrapper,
figure,
.col-md-5 {
  overflow: visible !important;
  max-height: none !important;
  height: auto !important;
}

.image-zoom-container {
  position: relative;
  display: block;
  width: 100%;
  cursor: zoom-in;
  overflow: visible !important;
}

.preview-image {
  width: 100%;
  height: auto !important;
  max-height: none !important;
  max-width: 100% !important;
  object-fit: contain !important;
  border-radius: 8px;
  display: block;
}

.image-zoom-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.zoom-overlay {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 10;
}

.image-zoom-container:hover .zoom-overlay {
  opacity: 1;
}

.zoom-overlay .fa-search-plus {
  font-size: 1rem;
}

/* MODAL DE ZOOM */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;
  padding: 40px 20px;
}

.image-modal-content {
  position: relative;
  width: 100%;
  max-width: 500px;
  animation: zoomIn 0.3s ease;
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: none;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  display: block;
}

.modal-caption {
  text-align: center;
  color: #fff;
  padding: 20px;
  font-size: 1.1rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0 0 8px 8px;
  width: 100%;
  margin-top: 0;
}

.modal-close-btn {
  position: fixed;
  top: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10000;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}

.text-muted {
  color: #6c757d;
}

.text-center {
  text-align: center;
}

.py-5 {
  padding: 3rem 0;
}

.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }

.btn {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: none;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--main-color, #c00014);
  color: var(--main-color, #c00014);
}

.btn-outline:hover {
  background: var(--main-color, #c00014);
  color: #fff;
}

.post-detail {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.post-detail li {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.post-detail .bold {
  font-weight: 600;
}

img.img-responsive {
  max-width: 100%;
  height: auto;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.browse-teachers-list li {
  margin-bottom: 2rem;
  text-align: center;
}

.browse-teachers-list figure {
  margin: 0 auto 1rem;
}

.browse-teachers-list h3 {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.browse-teachers-list .designation {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin: 0.2rem 0;
}

.teachers-follow {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.teachers-follow a {
  color: #333;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.teachers-follow a:hover {
  color: var(--main-color, #c00014);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 768px) {
  .modal-close-btn {
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .image-modal-overlay {
    padding: 20px 10px;
  }
}

@media (max-height: 600px) {
  .image-modal-overlay {
    padding: 60px 10px 20px;
  }
}
</style>

<script>
import { mapState } from "vuex";

export default {
  name: "DetalleCurso",

  data() {
    return {
      showImageModal: false,
    };
  },
  
  computed: {
    ...mapState(["cursos", "url_api"]),

    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo/uploads').trim();
    },

    cursoData() {
      const cursoId = parseInt(this.$route.params.idCur);
      
      if (!cursoId || !this.cursos?.length) {
        return null;
      }

      const curso = this.cursos.find(c => c.iddetalle_cursos_academicos === cursoId);
      
      if (!curso || !curso.iddetalle_cursos_academicos || !curso.det_img_portada) {
        return null;
      }
      
      return curso;
    },

    cursoNotFound() {
      return this.cursos?.length > 0 && !this.cursoData;
    },
  },
  
  methods: {
    openImageModal() {
      this.showImageModal = true;
      document.body.style.overflow = 'hidden';
    },
    
    closeImageModal() {
      this.showImageModal = false;
      document.body.style.overflow = '';
    },
    
    handleEscapeKey(event) {
      if (event.key === 'Escape' && this.showImageModal) {
        this.closeImageModal();
      }
    },
    
    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },
    clickBack() {
      this.$store.commit("clickLink");
      this.$router.go(-1);
    },
  },

  mounted() {
    document.addEventListener('keydown', this.handleEscapeKey);
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.body.style.overflow = '';
  },
  
  created() {
    this.$store.commit("loading");
  },
};
</script>