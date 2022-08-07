import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    whoru: ""
  },
  getters: {
    Author(state) {
      return state.whoru;
    }
  },
  mutations: {
    setAuthor(state, author) {
      state.whoru = author;
    },
    resetAuthor(state) {
      state.whoru = "";
    }
  },
  actions: {
    // 传入的参数从第二位开始
    func1({ commit, state }, para) {
      if (state.whoru) {
        commit("setAuthor", { desc: "执行mutations中的方法" });
      } else {
        commit("resetAuthor", { desc: "执行mutations中的方法" });
      }
    }
  }
});
