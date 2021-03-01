const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://woobottle.github.io',
    gaTrackingId: 'UA-164616831-1',
    trailingSlash: false,
  },
  header: {
    logo: 'https://img.icons8.com/ios/50/000000/sport-bottle.png',
    logoLink: 'https://woobottle.github.io',
    logoImage: 'https://img.icons8.com/ios/50/000000/sport-bottle.png',
    title:
      "이것저것 개발 블로그",
    githubUrl: 'https://github.com/woobottle',
    helpUrl: '',
    tweetText: '',
    social: ``,
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/introduction', // add trailing slash if enabled above
      '/books',
      '/algorithm',
    ],
    collapsedNav: [
      '/books', // add trailing slash if enabled above
      '/algorithm',
      '/algorithm/baekjoon',
      '/algorithm/list',
    ],
    links: [{ text: '', link: '' }],
    frontline: false,
    ignoreIndex: true,
    title:
      "",
  },
  siteMetadata: {
    title: 'woobottle',
    description: '개발블로그',
    ogImage: null,
    docsLocation: 'https://github.com/hasura/gatsby-gitbook-boilerplate/tree/master/content',
    favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Gatsby Gitbook Starter',
      short_name: 'GitbookStarter',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
