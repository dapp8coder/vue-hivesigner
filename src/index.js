const hivesigner = require('hivesigner');

export default {
  install(Vue, _options) {
    const options = Object.assign({}, _options, {
      scope: _options.scope || ['vote', 'comment']
    })

    const api = new hivesigner.Client({
      app: options.app,
      callbackURL: options.callbackURL,
      scope: options.scope || ['vote', 'comment']
    })

    Vue.prototype.$hivesigner = api
    // setting the api directly as the value does not work, methods are removed (why? serialization?)
    Vue.HiveSigner = () => {
      return api;
    }

    // store module
    Vue.HiveSignerStore = {
      namespaced: true,
      state: {
        user: null, // hivesigner user
        accessToken: null // hivesigner access token
      },
      getters: {
        user (state) {
          return state.user
        },
        accessToken (state) {
          return state.accessToken
        }
      },
      mutations: {
        login (state, user) {
          state.user = user
        },
        logout (state) {
          state.user = null
        },
        setAccessToken (state, accessToken) {
          state.accessToken = accessToken
        }
      },
      actions: {
        login ({ commit, dispatch, state }) {
          return new Promise((resolve, reject) => {
            // don't do anything if user data is already set
            if (!state.user) {
              // in that case we look for an access token in localStorage
              const accessToken = localStorage.getItem('access_token')
              if (accessToken) {
                // set access token and try to fetch user object
                Vue.HiveSigner().setAccessToken(accessToken)
                Vue.HiveSigner().me((err, user) => {
                  if (err) reject(err)
                  else {
                    // save user object in store
                    commit('login', user)
                    commit('setAccessToken', accessToken)
                    resolve()
                  }
                })
              }
            }
          })
        },
        logout ({ commit }) {
          // remove access token and unset user in store
          localStorage.removeItem('access_token')
          commit('logout')
          commit('setAccessToken', null)
        }
      }
    }
  }
}
