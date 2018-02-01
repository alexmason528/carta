// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors'

const errorLoading = err => {
  console.error('Dynamic page loading failed', err) // eslint-disable-line no-console
}

const loadModule = cb => componentModule => {
  cb(null, componentModule.default)
}

export default function createRootComponent(store) {
  const { injectSagas } = getAsyncInjectors(store) // eslint-disable-line no-unused-vars
  return {
    getComponent(nextState, cb) {
      const importModules = Promise.all([import('containers/App/sagas'), import('containers/App')])

      const renderRoute = loadModule(cb)

      importModules.then(([sagas, component]) => {
        injectSagas('global', sagas.default)
        renderRoute(component)
      })

      importModules.catch(errorLoading)
    },
    childRoutes: createRoutes(store),
  }
}

function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store)

  return [
    {
      path: '/quest(/:viewport/:types/:descriptives)',
      name: 'quest',
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('containers/QuestPage/reducer'), import('containers/QuestPage/sagas'), import('containers/QuestPage')])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('quest', reducer.default)
          injectSagas('quest', sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '/in/(:link)',
      name: 'brochure',
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('containers/BrochurePage/reducer'), import('containers/BrochurePage/sagas'), import('containers/BrochurePage')])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('brochure', reducer.default)
          injectSagas('brochure', sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '/(verify/:vcode)',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage/reducer'),
          import('containers/HomePage/sagas'),
          import('containers/HomePage'),
          import('containers/QuestPage/reducer'),
          import('containers/QuestPage/sagas'),
        ])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component, questPageReducer, questPageSagas]) => {
          injectReducer('home', reducer.default)
          injectSagas('home', sagas.default)
          injectReducer('quest', questPageReducer.default)
          injectSagas('quest', questPageSagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '/places',
      name: 'place',
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('containers/PlacePage/reducer'), import('containers/PlacePage/sagas'), import('containers/PlacePage')])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('place', reducer.default)
          injectSagas('place', sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '/themes',
      name: 'theme',
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('containers/ThemePage/reducer'), import('containers/ThemePage/sagas'), import('containers/ThemePage')])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('theme', reducer.default)
          injectSagas('theme', sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '/user/:username/profile',
      name: 'profile',
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('containers/ProfilePage/reducer'), import('containers/ProfilePage/sagas'), import('containers/ProfilePage')])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('profile', reducer.default)
          injectSagas('profile', sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '/user/:username/wishlist',
      name: 'wishlist',
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('containers/WishlistPage/reducer'), import('containers/WishlistPage/sagas'), import('containers/WishlistPage')])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('wishlist', reducer.default)
          injectSagas('wishlist', sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '/user/:username/friends',
      name: 'friends',
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('containers/FriendsPage/reducer'), import('containers/FriendsPage/sagas'), import('containers/FriendsPage')])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('friends', reducer.default)
          injectSagas('friends', sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading)
      },
    },
  ]
}
