// Pages configuration - defines routes and their corresponding page modules
export const pagesConfig = {
  // Home page - accessible via both / and /home
  '/': {
    module: '../pages/home.js',
    aliases: ['/home']
  },
  
  // Page preview
  '/page-preview': {
    module: '../pages/page-preview.js'
  },
  
  // About page
  '/about': {
    module: '../pages/about.js'
  }
  
  // Add more pages here as needed:
  // '/contact': {
  //   module: '../pages/contact.js',
  //   aliases: ['/get-in-touch']
  // }
}; 