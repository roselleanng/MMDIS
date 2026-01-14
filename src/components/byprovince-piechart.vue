<template>
  <div class="w-3/5 h-fit flex justify-center">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  components: { Pie },
  props: {
    provinceData: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartData() {
      return {
        labels: Object.keys(this.provinceData),
        datasets: [
          {
            label: 'Entries by Province',
            data: Object.values(this.provinceData),
            backgroundColor: ['#9FE2BF', '#32CD32', '#008000', '#8A9A5B', '#50C878'],
          },
        ],
      }
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Entries by Province'
          },
          legend: {
            position: 'right',
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const dataset = data.datasets[0];
                    const value = dataset.data[i];
                    return {
                      text: `${label}: ${value}`,
                      fillStyle: dataset.backgroundColor[i],
                      hidden: isNaN(dataset.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || '';
                if (context.parsed !== null) {
                  label += ': ' + context.parsed;
                }
                return label;
              },
            },
          },
        },
      }
    },
  },
}
</script>