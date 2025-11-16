// ✅ Declare Google Maps custom elements for TypeScript
export {};

declare global {
  // Extend JSX support so TSX recognizes custom tags
  namespace JSX {
    interface IntrinsicElements {
      "gmpx-place-autocomplete": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        placeholder?: string;
        value?: string;
        id?: string;
        style?: React.CSSProperties;
      };
    }
  }

  // Add .getPlace() support to the HTML element
  interface HTMLElement {
    getPlace?: () => google.maps.places.PlaceResult;
  }

  // Add Mappls SDK support
  interface Window {
    mappls?: {
      Map: unknown;
      [key: string]: unknown;
    };
  }
}
