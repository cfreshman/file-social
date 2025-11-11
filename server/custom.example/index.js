// Example custom routes for file-social
// Copy this entire directory to server/custom/ and add your own API routes
// You can split routes across multiple files and import them here

export default function customRoutes(app, { _01, ROOT }) {
  // Example: Custom API endpoint
  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from custom routes!' })
  })
  
  // Example: Using _01 for persistence
  // import { join } from 'path'
  // const myStore = _01(join(ROOT, '_01/mydata'))
  // myStore.data.value = myStore.data.value || 0
  // 
  // app.post('/api/mydata', async (req, res) => {
  //   myStore.data.value++
  //   await myStore.save()
  //   res.json(myStore.data)
  // })
  
  // Example: Import additional route files
  // import { setupAuthRoutes } from './auth.js'
  // setupAuthRoutes(app, { _01, ROOT })
  
  // Add your custom routes here
}

