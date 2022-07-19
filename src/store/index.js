import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    counts: 9527,
    lists: [0, 1, 2, 3, 4, 5]
  },
  getters: {
    countsCanBeUsed(state) {
      return state.counts - 9000;
    }
  },
  actions: {
    addCounts() {
      this.state.counts++;
    },
    minusCounts() {
      this.state.counts--;
    },
    addToLists() {
      const m = this.state.lists.length;
      this.state.lists.push(m);
    },
    minusFromLists() {
      this.state.lists.pop();
    }
  }
});
