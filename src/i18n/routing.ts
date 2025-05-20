import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ha', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    // '/pathnames': {
    //   ha: '/pfadnamen'
    // }
  }
});