export default {
  // App configuration
  name: process.env.APP_NAME || 'file-social',
  port: process.env.PORT || 7650,
  
  // Paths
  postsDir: process.env.POSTS_DIR || './posts',
  publicDir: process.env.PUBLIC_DIR || './public',
  
  // Domain (for generating URLs)
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 7650}`,
}

