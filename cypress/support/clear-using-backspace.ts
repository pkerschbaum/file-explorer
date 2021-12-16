import { cy, Cypress } from 'local-cypress';
import invariant from 'tiny-invariant';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      clearUsingBackspace(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add(
  'clearUsingBackspace',
  {
    prevSubject: true,
  },
  clearUsingBackspace,
);

function clearUsingBackspace(subject?: unknown) {
  invariant(subject);
  return cy.wrap(subject).type('{selectall}{backspace}');
}
