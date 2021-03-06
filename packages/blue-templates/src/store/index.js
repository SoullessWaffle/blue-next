import mutations from './mutations'
import state from './state'
import getters from './getters'
import actions from './actions'

/**
 * {{name}} module export
 * @author {{author.name}} <{{author.email}}>
 * @type {Object}
 */
export default {
  {{#if hasNamespace}}
  namespaced: true,
  {{/if}}
  state,
  mutations,
  getters,
  actions
}
