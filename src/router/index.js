import Vue from 'vue'
import Router from 'vue-router'

import Header from '@/views/navbar/Header'
import Footer from '@/views/navbar/Footer'
import Home from '@/views/HomeProduct'
import FashionShow from '@/views/FashionShow'
import Contact from '@/views/Contact'
import News from '@/views/News'
import NewsDetail from '@/views/NewsDetail'
import Portfolio from '@/views/Portfolio'
import ShowDisplay from '@/views/ShowDetail'
import Login from '@/views/Login'

import CreateNews from '@/views/admin/CreateNews'
import ProductList from '@/views/admin/ProductList'
import Tags from '@/views/admin/Tags'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      components: {
        headerBar: Header,
        mainPage: Home,
        footerBar: Footer
      }
    },
    {
      path: '/talent/:secondMenu',
      name: 'talent',
      components: {
        headerBar: Header,
        mainPage: FashionShow,
        footerBar: Footer
      }
    },
    {
      path: '/fashionShow/:secondMenu',
      name: 'fashionShow',
      components: {
        headerBar: Header,
        mainPage: FashionShow,
        footerBar: Footer
      }
    },
    {
      path: '/photography/:secondMenu',
      name: 'photography',
      components: {
        headerBar: Header,
        mainPage: FashionShow,
        footerBar: Footer
      }
    },
    {
      path: '/contact',
      name: 'contact',
      components: {
        headerBar: Header,
        mainPage: Contact,
        footerBar: Footer
      }
    },
    {
      path: '/news',
      name: 'news',
      components: {
        headerBar: Header,
        mainPage: News,
        footerBar: Footer
      }
    },
    {
      path: '/newsDetail/:newsId',
      name: 'newsDetail',
      components: {
        headerBar: Header,
        mainPage: NewsDetail,
        footerBar: Footer
      }
    },
    {
      path: '/portfolio/:designerId',
      name: 'portfolio',
      components: {
        headerBar: Header,
        mainPage: Portfolio,
        footerBar: Footer
      }
    },
    {
      path: '/showDisplay/:showId',
      name: 'showDisplay',
      components: {
        headerBar: Header,
        mainPage: ShowDisplay,
        footerBar: Footer
      }
    },
    {
      path: '/login',
      name: 'login',
      components: {
        headerBar: Header,
        mainPage: Login,
        footerBar: Footer
      }
    },
    {
      path: '/admin/news/create',
      name: 'createNews',
      meta: {role: ['admin']},
      components: {
        headerBar: Header,
        mainPage: CreateNews,
        footerBar: Footer
      }
    },
    {
      path: '/admin/products',
      redirect: '/admin/products/[empty]/1'
    },
    {
      path: '/admin/products/:inputSearch/:curPage',
      name: 'products',
      meta: {role: ['admin']},
      components: {
        headerBar: Header,
        mainPage: ProductList,
        footerBar: Footer
      }
    },
    {
      path: '/admin/tags',
      name: 'tags',
      meta: {role: ['admin']},
      components: {
        headerBar: Header,
        mainPage: Tags,
        footerBar: Footer
      }
    },
    {
      path: '/*',
      redirect: '/home'
    }
  ]
})

export default router
