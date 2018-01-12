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

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store)

  return [
    {
      path: '/quest(/in/:brochure)(/:viewport/:types/:descriptives)',
      name: 'questPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/QuestPage/reducer'),
          import('containers/QuestPage/sagas'),
          import('containers/QuestPage'),
        ])

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
      path: '/(verify/:vcode)',
      name: 'homePage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage/reducer'),
          import('containers/HomePage/sagas'),
          import('containers/HomePage'),
        ])

        const renderRoute = loadModule(cb)

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default)
          injectSagas('home', sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    },
    {
      path: '/places',
      name: 'placePage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PlacePage/reducer'),
          import('containers/PlacePage/sagas'),
          import('containers/PlacePage'),
        ])

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
      name: 'themePage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ThemePage/reducer'),
          import('containers/ThemePage/sagas'),
          import('containers/ThemePage'),
        ])

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
