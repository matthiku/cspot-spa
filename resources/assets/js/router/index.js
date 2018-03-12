/**
 * Register and configure all Vue frontend routes
 *
 * (C) 2018 Matthias Kuhs
 */
import Vue from 'vue'
import Router from 'vue-router'

import AuthGuard from './auth-guard'

import Home from '../components/Home'

import Admin from '../components/Admin/Admin'
import Users from '../components/Admin/Users'

import Profile from '../components/User/Profile'
import Signin from '../components/User/Signin'
import Signup from '../components/User/Signup'

import Songs from '../components/Song/Songs'

import Plan from '../components/Plan/Plan'
import Plans from '../components/Plan/Plans'
import Presentation from '../components/Plan/Present/Presentation'
import CreatePlan from '../components/Plan/CreatePlan'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'signin',
      meta: { title: 'Sign In' },
      component: Signin
    },
    {
      path: '/register',
      name: 'signup',
      meta: { title: 'Sign Up' },
      component: Signup
    },
    {
      path: '/',
      name: 'home',
      meta: { title: 'Home' },
      component: Plans,
      beforeEnter: AuthGuard
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { title: 'User Profile' },
      beforeEnter: AuthGuard
    },
    {
      path: '/createplan',
      name: 'createplan',
      meta: { title: 'Create new Plan' },
      component: CreatePlan,
      beforeEnter: AuthGuard
    },
    {
      path: '/plans',
      name: 'plans',
      component: Plans,
      meta: { title: 'Plans List' },
      beforeEnter: AuthGuard
    },
    {
      path: '/plans/:planId',
      name: 'plan',
      props: true,
      component: Plan,
      meta: { title: 'Plan Details' },
      beforeEnter: AuthGuard
    },
    {
      path: '/nextsunday',
      name: 'nextsunday',
      component: Plan,
      meta: { title: 'Next Sunday' },
      beforeEnter: AuthGuard
    },
    {
      path: '/addsongtoplan',
      name: 'addsongtoplan',
      component: Songs,
      meta: { title: 'Songs' },
      beforeEnter: AuthGuard
    },
    {
      path: '/present/:itemId?',
      name: 'present',
      props: true,
      component: Presentation,
      meta: { title: 'Presentation' },
      beforeEnter: AuthGuard
    },
    {
      path: '/songs',
      name: 'songs',
      component: Songs,
      meta: { title: 'Songs' },
      beforeEnter: AuthGuard
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { title: 'Administration' },
      beforeEnter: AuthGuard
    },
    {
      path: '/admin/users',
      name: 'users',
      component: Users,
      meta: { title: 'Users' },
      beforeEnter: AuthGuard
    },
    {
      path: '/admin/users/:userId',
      name: 'user',
      component: Profile,
      meta: { title: 'User Profile' },
      beforeEnter: AuthGuard,
      props: true
    }
  ],
  mode: 'history'
})
