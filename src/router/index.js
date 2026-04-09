import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'appWrapper',
    component: () => import('@/pages/AppWrapper.vue'),
    children: [
      {
        path: '/',
        name: 'homeApp',
        component: () => import('@/views/HomeCustom.vue')
      },
      {
        path: '/convocatorias/:tipo_conv',
        name: 'convocatorias',
        component: () => import('@/views/Convocatorias/ConvocatoriasView.vue')
      },
      {
        path: '/detalleConvocatoria/:idConv',
        name: 'detalleConvocatoria',
        component: () => import('@/views/Convocatorias/DetalleConvocatoria.vue')
      },
      {
        path: '/cursos/:tipo_cur',
        name: 'cursos',
        component: () => import('@/views/Cursos/CursosView.vue')
      },
      {
        path: '/detalleCurso/:idCur',
        name: 'detalleCurso',
        component: () => import('@/views/Cursos/DetalleCurso.vue')
      },
      {
        path: '/servicios',
        name: 'servicios',
        component: () => import('@/views/Servicios/ServiciosView.vue')
      },
      {
        path: '/DetalleServicio/:idServ',
        name: 'detalleServicio',
        component: () => import('@/views/Servicios/DetalleServicio.vue')
      },
      {
        path: '/ofertas',
        name: 'ofertas',
        component: () => import('@/views/Ofertas/OfertasView.vue')
      },
      {
        path: '/detalleOferta/:idOfer',
        name: 'detalleOferta',
        component: () => import('@/views/Ofertas/DetalleOferta.vue')
      },
      {
        path: '/publicaciones',
        name: 'publicacionesView',
        component: () => import('@/views/Publicaciones/PublicacionesView.vue')
      },
      {
        path: '/detallePublicacion/:idPub',
        name: 'detallePublicacion',
        component: () => import('@/views/Publicaciones/DetallePublicacion.vue')
      },
      {
        path: '/gaceta',
        name: 'GacetaView',
        component: () => import('@/views/Gaceta/GacetaView.vue')
      },
      {
        path: '/DetalleGaceta/:idGac',
        name: 'detalleGaceta',
        component: () => import('@/views/Gaceta/DetalleGaceta.vue')
      },
      {
        path: '/eventos',
        name: 'eventosView',
        component: () => import('@/views/Eventos/EventosView.vue')
      },
      {
        path: '/detalleEvento/:idEv',
        name: 'detalleEvento',
        component: () => import('@/views/Eventos/DetalleEvento.vue')
      },
      {
        path: '/videos',
        name: 'videosView',
        component: () => import('@/views/Videos/VideosView.vue')
      },
      {
        path: '/detalleVideo/:idVid',
        name: 'detalleVideo',
        component: () => import('@/views/Videos/DetalleVideo.vue')
      },
      {
        path: '/about',
        name: 'aboutView',
        component: () => import('@/views/AboutView.vue')
      },
      {
        path: '/historia',
        name: 'historiaView',
        component: () => import('@/views/HistoriaView.vue')
      },
{
  path: '/instituto',
  name: 'InstitutoView',
  component: () => import('@/views/Instituto/InstitutoView.vue')  
},{
  path: '/instituto/detalle-gaceta/:id',
  name: 'DetalleGacetaInstituto',
  component: () => import('@/views/Instituto/DetalleGacetaInstituto.vue')
},
{
  path: '/instituto/detalle-evento/:id',
  name: 'DetalleEventoInstituto',
  component: () => import('@/views/Instituto/DetalleEventoInstituto.vue')
},
{
  path: '/instituto/detalle-publicacion/:id',
  name: 'DetallePublicacionInstituto',
  component: () => import('@/views/Instituto/DetallePublicacionInstituto.vue')
}
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404Page',
    component: () => import('@/pages/404Page.vue')
  },
  {
    path: '/error_network',
    name: 'error_network',
    component: () => import('@/pages/ErrorNetwork.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const isProd = process.env.VUE_APP_ENV === 'production'
  if (!isProd) {
    console.log(`[Router] Navegando de ${from.path} a ${to.path}`)
  }
  next()
})

export default router