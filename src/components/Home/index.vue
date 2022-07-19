<template>
  <div class="main">
    <h1>{{ msg }}</h1>
    <div id="chart"></div>

    <div class="test-vuex">
      <h3>mapGetters:{{ countsCanBeUsed }}</h3>
      <h3>Store值 counts:{{ counts }}——————lists:{{ lists }}</h3>
      <div>
        <button @click="addCounts">counts++</button>
        <button @click="minusCounts">counts--</button>
        <button @click="addToLists">lists++</button>
        <button @click="minusFromLists">lists--</button>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to JobGuide"
    };
  },
  computed: {
    ...mapGetters(["countsCanBeUsed"]),
    ...mapState(["counts", "lists"])
  },
  methods: {
    ...mapActions(["addCounts", "minusCounts", "addToLists", "minusFromLists"])
  },
  mounted() {
    var chartDom = document.getElementById("chart");
    var myChart = echarts.init(chartDom);
    var option;

    let base = +new Date(1988, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let data = [[base, Math.random() * 300]];
    for (let i = 1; i < 20000; i++) {
      let now = new Date((base += oneDay));
      data.push([
        +now,
        Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])
      ]);
    }
    option = {
      tooltip: {
        trigger: "axis",
        position: function(pt) {
          return [pt[0], "10%"];
        }
      },
      title: {
        left: "center",
        text: "ECharts demo"
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none"
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "time",
        boundaryGap: false
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"]
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 20
        },
        {
          start: 0,
          end: 20
        }
      ],
      series: [
        {
          name: "Fake Data",
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {},
          data: data
        }
      ]
    };

    option && myChart.setOption(option);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  text-align: center;
}
.test-vuex {
  width: 60%;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid salmon;
}
#chart {
  width: 600px;
  height: 400px;
  margin: 20px auto;
}
a {
  color: #42b983;
}
</style>
