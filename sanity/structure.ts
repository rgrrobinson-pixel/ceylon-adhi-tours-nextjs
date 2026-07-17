import { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Your website')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.listItem()
        .title('Hero section')
        .id('hero')
        .child(S.document().schemaType('hero').documentId('hero')),
      S.listItem()
        .title('About section')
        .id('about')
        .child(S.document().schemaType('about').documentId('about')),
      S.listItem()
        .title('Photo gallery (Travelling with Adhi)')
        .id('gallery')
        .child(S.document().schemaType('gallery').documentId('gallery')),
      S.listItem()
        .title('Destinations gallery')
        .id('destinationsGallery')
        .child(
          S.document()
            .schemaType('destinationsGallery')
            .documentId('destinationsGallery')
        ),
      S.listItem()
        .title('Tour packages section')
        .id('tourPackagesSection')
        .child(
          S.document()
            .schemaType('tourPackagesSection')
            .documentId('tourPackagesSection')
        ),
      S.listItem()
        .title('Video (Watch) section')
        .id('videoSection')
        .child(
          S.document()
            .schemaType('videoSection')
            .documentId('videoSection')
        ),
      S.divider(),
      S.documentTypeListItem('service').title('Services / Tours'),
      S.documentTypeListItem('itinerary').title('Itineraries'),
      S.documentTypeListItem('destination').title('Destinations'),
      S.documentTypeListItem('landingPage').title('Landing Pages'),
      S.documentTypeListItem('review').title('Reviews'),
      S.documentTypeListItem('faqItem').title('FAQ items'),
    ]);
