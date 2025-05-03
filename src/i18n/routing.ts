import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ha'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    // '/pathnames': {
    //   ha: '/pfadnamen'
    // }
  }
});