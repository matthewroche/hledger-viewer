import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/balance-sheet',
      name: 'balance-sheet',
      component: () => import('../views/BalanceSheet.vue')
    },
    {
      path: '/balance-sheet-equity',
      name: 'balance-sheet-equity',
      component: () => import('../views/BalanceSheetEquity.vue')
    },
    {
      path: '/income-statement',
      name: 'income-statement',
      component: () => import('../views/IncomeStatement.vue')
    },
    {
      path: '/cash-flow',
      name: 'cash-flow',
      component: () => import('../views/CashFlow.vue')
    },
    {
      path: '/graphs/net-worth',
      name: 'net-worth',
      component: () => import('../views/GraphNetWorth.vue')
    },
    {
      path: '/graphs/expenses-breakdown',
      name: 'expenses-breakdown',
      component: () => import('../views/GraphExpensesBreakdown.vue')
    },
    {
      path: '/graphs/income-breakdown',
      name: 'income-breakdown',
      component: () => import('../views/GraphIncomeBreakdown.vue')
    },
    {
      path: '/graphs/income-vs-expenses',
      name: 'income-vs-expenses',
      component: () => import('../views/GraphIncomeVsExpenses.vue')
    },
    {
      path: '/graphs/assets-vs-liabilities',
      name: 'assets-vs-liabilities',
      component: () => import('../views/GraphAssetsVsLiabilities.vue')
    }
  ]
})

export default router
