// ***********************************************
// This example commands.js shows you how to
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

import { faker } from "@faker-js/faker";

Cypress.Commands.add("createRecommendation", () => {
  cy.visit("http://localhost:3000/");
  const songName = faker.lorem.words(3);

  cy.get("#song-name").type(songName);
  cy.get("#song-url").type("https://www.youtube.com/watch?v=kiB9qk4gnt4");

  cy.intercept("POST", "/recommendations").as("newRecommendation");
  cy.get("#send-button").click();
  cy.wait("@newRecommendation");

  cy.contains(songName).should("be.visible");
});

Cypress.Commands.add("upvoteRecommendation", () => {
  cy.visit("http://localhost:3000/");
  const songName = faker.lorem.words(3);

  cy.get("#song-name").type(songName);
  cy.get("#song-url").type("https://www.youtube.com/watch?v=kiB9qk4gnt4");

  cy.intercept("POST", "/recommendations").as("newRecommendation");
  cy.get("#send-button").click();
  cy.wait("@newRecommendation");

  cy.get("#upvote").click();

  /* cy.contains(songName).should("be.visible"); */
  cy.get("#score").contains(1).should("be.visible")
});

/* Cypress.Commands.add("getTopRecommendation", () => {
  cy.visit("http://localhost:3000/top");
  cy.get([bla]).should('have.length.lessThan,11) -> ver se o tamanho dos itens é x
  cy.get("#recommendationId").
}); */