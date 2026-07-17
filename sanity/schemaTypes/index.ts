import { type SchemaTypeDefinition } from 'sanity';

import { siteSettings } from './siteSettings';
import { hero } from './hero';
import { about } from './about';
import { service } from './service';
import { faqItem } from './faqItem';
import { review } from './review';
import { gallery } from './gallery';
import { destinationsGallery } from './destinationsGallery';
import { videoSection } from './videoSection';
import { tourPackagesSection } from './tourPackages';
import { itinerary } from './itinerary';
import { destination } from './destination';
import { landingPage } from './landingPage';

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  hero,
  about,
  service,
  tourPackagesSection,
  faqItem,
  review,
  gallery,
  destinationsGallery,
  videoSection,
  itinerary,
  destination,
  landingPage,
];
