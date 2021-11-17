import { sanitize } from '@storybook/csf';
import { cy } from 'local-cypress';

export function bootstrap({ storybookIdToVisit }: { storybookIdToVisit: string }) {
  cy.fixCypressSpec();
  cy.visit(`http://localhost:6006/iframe.html?viewMode=story&args=&id=${storybookIdToVisit}`);
  // wait for page load by waiting for the React app to get rendered into the #root Container
  cy.get('#root').children().should('have.length.at.least', 1);
}

export function getTestTitle(): string {
  return Cypress.currentTest.titlePath.map(sanitize).join('_');
}
