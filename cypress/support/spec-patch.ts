// https://github.com/cypress-io/cypress/issues/3090#issuecomment-889470707
import { Cypress } from 'local-cypress';
import path from 'path';

declare global {
  namespace Cypress {
    interface Chainable {
      fixCypressSpec(): void;
    }
  }
}

Cypress.Commands.add('fixCypressSpec', function (this: any) {
  const { absoluteFile, relativeFile } = this.test.invocationDetails;
  Cypress.spec = {
    ...Cypress.spec,
    absolute: absoluteFile,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    name: path.basename(absoluteFile),
    relative: relativeFile,
  };
});
