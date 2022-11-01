/* allow CSS custom properties for "style" attribute of components (https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors) */
import 'csstype';

type CSSCustomProperty = `--${string}`;

declare module 'csstype' {
  interface Properties {
    [customProp: CSSCustomProperty]: string | undefined;
  }
}
