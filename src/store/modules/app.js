const state = {
  notFound: false,
  songPerPlaylist: 20
};

const getters = {
  notFound: (state) => state.notFound,
  songPerPlaylist: (state) => state.songPerPlaylist,
};

const mutations = {
  SET_NOT_FOUND(state, status) {
    state.notFound = status;
  },
  SET_SONG_PLAYLIST(state, songs) {
    state.songPerPlaylist = songs
  }
};

const actions = {
  notFoundPage({ commit }, status) {
    commit("SET_NOT_FOUND", status);
  },
  setSongPlaylist({ commit }, songs) {
    commit("SET_SONG_PLAYLIST", songs);
  },

  init({ dispatch, rootGetters }) {
    if (rootGetters["auth/getAccessToken"]) {
      dispatch("user/getUserProfile", null, { root: true });
    }
    dispatch("player/init", null, { root: true });
  }
};

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default module;
