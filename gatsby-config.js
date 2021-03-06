require('dotenv').config();
const globalConfig = require('./global-config');

const query = `{
  allMarkdownRemark {
    totalCount
    edges {
      node {
        objectID: id
        fields {
          slug
        }
        excerpt
        frontmatter {
          date(formatString: "YYYY. MM. DD. HH:mm")
          title
          cover {
            childImageSharp {
              resize(width: 300) {
                coverImage: src
              }
            }
          }
          tags
        }
      }
    }
  }
}`;

const queries = [
  {
    query,
    transformer: ({ data }) =>
      data.allMarkdownRemark.edges.map(({ node }) => node),
  },
];

module.exports = {
  siteMetadata: {
    title: globalConfig.siteTitle,
    description: globalConfig.description,
    siteUrl: globalConfig.siteUrl,
    algolia: {
      appId: process.env.ALGOLIA_APP_ID ? process.env.ALGOLIA_APP_ID : '',
      searchOnlyApiKey: process.env.ALGOLIA_SEARCH_ONLY_API_KEY
        ? process.env.ALGOLIA_SEARCH_ONLY_API_KEY
        : '',
      indexName: process.env.ALGOLIA_INDEX_NAME
        ? process.env.ALGOLIA_INDEX_NAME
        : '',
    },
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-netlify-cms',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-feed',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-emoji',
          'gatsby-remark-prismjs',
          'gatsby-remark-external-links',
          'gatsby-remark-copy-linked-files',
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'contents',
        path: `${__dirname}/blog-posts/contents/`,
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: globalConfig.siteUrl,
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
        head: true,
      },
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID ? process.env.ALGOLIA_APP_ID : '',
        apiKey: process.env.ALGOLIA_ADMIN_API_KEY
          ? process.env.ALGOLIA_ADMIN_API_KEY
          : '',
        indexName: process.env.ALGOLIA_INDEX_NAME
          ? process.env.ALGOLIA_INDEX_NAME
          : '',
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: globalConfig.siteTitle,
        short_name: globalConfig.siteTitle,
        start_url: '/',
        background_color: '#1B1C1D',
        theme_color: '#1B1C1D',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
  ],
};
