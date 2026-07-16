import { groq } from 'next-sanity';

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  businessName, tagline, logo, theme, primaryColor, contactEmail, contactPhone,
  whatsappNumber, areaServed, currency, bookingUrl, reviewCount, reviewsUrl
}`;

export const heroQuery = groq`*[_type == "hero"][0]{
  headline, subheadline, heroImage, primaryCtaLabel, primaryCtaLink
}`;

export const aboutQuery = groq`*[_type == "about"][0]{
  heading, ownerName, yearsExperience, portrait, body
}`;

export const servicesQuery = groq`*[_type == "service"] | order(order asc){
  _id, title, description, priceFrom, priceUnit, image, order
}`;

export const faqsQuery = groq`*[_type == "faqItem"] | order(order asc){
  _id, question, answer, order
}`;

export const reviewsQuery = groq`*[_type == "review"] | order(date desc){
  _id, author, ratingValue, text, sourceName, date
}`;

export const galleryQuery = groq`*[_type == "gallery"][0]{
  eyebrow, heading, subheading,
  photos[]{ _key, caption, asset }
}`;

export const destinationsGalleryQuery = groq`*[_type == "destinationsGallery"][0]{
  eyebrow, heading, subheading,
  photos[]{ _key, caption, asset }
}`;

export const tourPackagesQuery = groq`*[_type == "tourPackagesSection"][0]{
  enabled, eyebrow, heading, subheading,
  packages[]{ _key, title, forPeople, originalPrice, offerPrice, perDayNote, highlight },
  inclusions, exclusions, footnote, ctaLabel,
  showVehicleSection, vehicleHeading, vehicleText, vehicleImage, vehicleImageAlt
}`;

export const videoSectionQuery = groq`*[_type == "videoSection"][0]{
  eyebrow, heading, subheading,
  videos[]{
    _key, caption,
    "videoUrl": video.asset->url,
    "videoMime": video.asset->mimeType,
    poster
  },
  "videoUrl": video.asset->url,
  "videoMime": video.asset->mimeType,
  poster
}`;
