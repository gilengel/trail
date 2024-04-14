/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

import { createPinia, setActivePinia } from 'pinia'
import { useRouteStore } from '../../src/stores/route'
import { useImageStore } from '../../src/stores/image'

setActivePinia(createPinia())

const routeStore = useRouteStore()
const imageStore = useImageStore()

Cypress.Commands.add('getRouteStore', () => routeStore)
Cypress.Commands.add('getImageStore', () => imageStore)

const Commands = {}
export default Commands
