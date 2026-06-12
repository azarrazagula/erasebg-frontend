/**
 * Core Union representing the active step of background removal processing.
 * - 0: Analyzing Subject Elements
 * - 1: Isolating Edge Boundaries
 * - 2: Executing Neural Network
 * - 3: Upscaling Transparency Mask
 */
export type LoadingStep = 0 | 1 | 2 | 3;

/**
 * Interface mapping configuration properties of preset test cards.
 */
export interface ExampleImage {
  /** Label describing target category, e.g. Portrait, Product, Animal */
  label: string;
  /** Direct URL link referencing the sample image source */
  url: string;
  /** Desired filename output to use when compiling file mocks */
  filename: string;
}
