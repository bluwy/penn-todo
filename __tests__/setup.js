import VueTestUtils from '@vue/test-utils'

process.env.NODE_ENV = 'test'
require('dotenv').config()

// Mock Nuxt components
VueTestUtils.config.stubs['nuxt-link'] = '<a><slot /></a>'
VueTestUtils.config.stubs['no-ssr'] = '<span><slot /></span>'
