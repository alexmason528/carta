// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
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
  const {
    injectReducer,
    injectSagas,
    redirectToHome,
    redirectToVerify,
  } = getAsyncInjectors(store)

  return [
    {
      path: '/(i/:brochure)(p/:viewport/:types/:descriptives)',
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
          injectSagas(sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    }, {
      onEnter: redirectToVerify,
      path: '/home',
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
          injectSagas(sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    }, {
      onEnter: redirectToHome,
      path: '/verify(/:vcode)',
      name: 'homePage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/VerifyPage/sagas'),
          import('containers/VerifyPage'),
        ])

        const renderRoute = loadModule(cb)

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default)

          renderRoute(component)
        })

        importModules.catch(errorLoading)
      },
    }, {
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
