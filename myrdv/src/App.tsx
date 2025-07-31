import { Provider } from 'react-redux'
import { store } from './lib/store'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <HomePage />
      </Layout>
    </Provider>
  )
}

export default App
