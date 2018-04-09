const agents = {
  state: {
    selected: []
  },
  mutations: {
    SET_SELECTED_AGENTS: (state, selectedAgents) => {
      state.selected = selectedAgents
    }
  },
  actions: {
    setSelectAgents ({ commit }, selectedAgents) {
      commit('SET_SELECTED_AGENTS', selectedAgents)
    }
  }
}

export default agents
