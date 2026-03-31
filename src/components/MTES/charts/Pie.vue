<template>
    <div class="piechart1">
        <Pie id="my-chart-id" :options="chartOptions" :data="chartData" v-if="chartDataReady"/>
    </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import axios from 'axios';
import { detail_id } from '@/views/mtes/dashboards/FTAA-dashboard.vue';
import { API_BASE_URL } from '../../../config'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: 'PieChart',
    components: { Pie },
    props: {
        application: String,
        mode: {
      type: String,
      default: 'new' // safety default
    }
    },
    data() {
        return {
            chartData: {
                labels: ['Bukidnon', 'Misamis Oriental', 'Misamis Occidental', 'Lanao del Norte', 'Camiguin', 'Cagayan de Oro City', 'Iligan City'],
                datasets: [
                    {
                        backgroundColor: ['#9FE2BF', '#32CD32', '#008000', '#50C878', '#8A9A5B', '#355E3B','#C1E1C1'],
                        data: [0, 0, 0, 0, 0, 0, 0] // Initialize with zeros
                    }
                ]
            },
            chartOptions: {
                responsive: true
            },
            chartDataReady: false,
        }
    },
    mounted() {
        this.fetchProvinceData();
    },
    watch: {
        application: function() {
            this.resetChartData();
            this.fetchProvinceData();
        },
        mode: function() {
            this.resetChartData();
            this.fetchProvinceData();
        }
    },
    methods: {
        fetchProvinceData() {
            axios.get(`${API_BASE_URL}/get_details/`)
                .then(response => {
                    const provinceCounts = {
                        'bukidnon': 0,
                        'misamis oriental': 0,
                        'misamis occidental': 0,
                        'lanao del norte': 0,
                        'camiguin': 0,
                    };
                    const cityCounts = {
                        'cagayan de oro city (capital)': 0,
                        'iligan city': 0,
                    };

                    let filteredData = response.data;


                        if (this.mode === 'new') {
                        // NEW APPLICATION VIEW
                        filteredData = filteredData.filter(pie =>
                        pie.application?.toString().toLowerCase().trim() === this.application?.toString().toLowerCase().trim() &&
                        pie.status !== 'Issued'
                        );

                    } else if (this.mode === 'permit') {
                        // PERMIT VIEW
                        filteredData = filteredData.filter(bar =>
                        bar.application?.toString().toLowerCase().trim() === this.application?.toString().toLowerCase().trim() &&
                        bar.status === 'Issued'
                        );
                    }

                    filteredData.forEach(item => {
                            // Convert province values to lowercase for consistency
                            const provinces = [
                                item.province?.toLowerCase(),
                                item.province1?.toLowerCase(),
                                item.province2?.toLowerCase(),
                                item.province3?.toLowerCase()
                            ];

                            const cities = [
                                item.city?.toLowerCase(),
                                item.city1?.toLowerCase(),
                                item.city2?.toLowerCase(),
                                item.city3?.toLowerCase()
                            ];

                            // Count occurrences in province columns
                            provinces.forEach(prov => {
                                if (prov && provinceCounts.hasOwnProperty(prov)) {
                                    provinceCounts[prov]++;
                                }
                            });

                            // Count occurrences in city columns
                            cities.forEach(cty => {
                                if (cty && cityCounts.hasOwnProperty(cty)) {
                                    cityCounts[cty]++;
                                }
                            });
                        });

                    this.updateChartData(provinceCounts, cityCounts);
                })
                .catch(error => {
                    console.error('Error fetching province data:', error);
                });
        },

        updateChartData(provinceCounts,cityCounts) {
            const data = this.chartData.datasets[0].data;
            data[0] = provinceCounts['bukidnon'];
            data[1] = provinceCounts['misamis oriental'];
            data[2] = provinceCounts['misamis occidental'];
            data[3] = provinceCounts['lanao del norte'];
            data[4] = provinceCounts['camiguin'];
            data[5] = cityCounts['cagayan de oro city (capital)'];
            data[6] = cityCounts['iligan city'];
            this.$forceUpdate(); // Force Vue to re-render the chart
            this.chartDataReady = true;
        },
        resetChartData() {
            this.chartData.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
            this.chartDataReady = false;
        }
    }
}
</script>

<style scoped>
.piechart1 {
    display: flex;
    flex-wrap: wrap;
}
</style>
