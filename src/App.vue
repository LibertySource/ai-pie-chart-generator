<template>
  <div class="bg-winter-blue text-deep-blue">
    <div id="loadingOverlay" class="modal-overlay" v-show="loading">
      <div class="spinner"></div>
    </div>
    <div class="container mx-auto max-w-3xl p-6">
      <header class="bg-ice-blue p-6 rounded-lg mb-6">
        <h1 class="text-2xl font-bold">AI Pie Chart Generator</h1>
      </header>

      <div class="mb-6">
        <p>Supply a reasonable JSON string suitable for being displayed as a pie chart, and AI will be used to display
          the data using <a class="text-blue-500 underline" href="https://www.chartjs.org/docs/latest/api/"
            target="_blank">Chart.js</a></p>
      </div>

      <HiddenInput v-model="accessKey" label="Access Key" />
      <HiddenInput v-model="accessSecretKey" label="Access Secret Key" />
      <HiddenInput v-model="promptId" label="Prompt Id" />

      <div class="mb-4">
        <label for="sampleJson" class="block mb-2">Sample JSON</label>
        <select id="sampleJson" class="w-full p-2 border rounded" v-model="selectedSample" @change="updateJsonInput">
          <option value="">Select a sample</option>
          <option v-for="(sample, index) in sampleJsons" :key="index" :value="sample.value">{{ sample.title }}</option>
        </select>
      </div>

      <div class="mb-4">
        <label for="jsonInput" class="block mb-2">JSON</label>
        <textarea id="jsonInput" rows="5" class="w-full p-2 border rounded" v-model="jsonInput"></textarea>
      </div>

      <button @click="generatePieChart"
        class="bg-button-blue text-white p-2 rounded hover:bg-blue-700 transition duration-300">
        Generate Pie Chart
      </button>
      <canvas ref="pieChartCanvas" width="400" height="400"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import { BedrockAgentRuntimeClient, InvokeFlowCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import HiddenInput from './components/HiddenInput.vue';

const accessKey = ref<string>('');
const accessSecretKey = ref<string>('');
const promptId = ref<string>('');
const jsonInput = ref<string>('');
const selectedSample = ref<string>('');
const loading = ref<boolean>(false);
const pieChartCanvas = ref<HTMLCanvasElement | null>(null);
const myChart = ref<Chart | null>(null);

const sampleJsons = [
  { "title": "Simple Pie Chart", "value": '{"data":[{"label":"A","value":30},{"label":"B","value":50},{"label":"C","value":20}]}' },
  { "title": "Complex Pie Chart 1", "value": '{"chartData":[{"label":"RedApples","value":35,"color":"#FF6384"},{"label":"GreenPears","value":25,"color":"#36A2EB"},{"label":"PurpleGrapes","value":20,"color":"#9966FF"},{"label":"YellowBananas","value":15,"color":"#FFCE56"},{"label":"OrangeOranges","value":5,"color":"#FF9F40"}]}' },
  { "title": "Complex Pie Chart 2", "value": `{"starWarsCharacters":[ {"name":"Luke Skywalker","screenTime":12.5,"color":"#3498db"}, {"name":"Darth Vader","screenTime":11.8,"color":"#e74c3c"}, {"name":"Princess Leia","screenTime":9.7,"color":"#9b59b6"}, {"name":"Han Solo","screenTime":10.2,"color":"#34495e"}, {"name":"Obi-Wan Kenobi","screenTime":8.6,"color":"#2ecc71"}, {"name":"Yoda","screenTime":7.9,"color":"#27ae60"}, {"name":"Chewbacca","screenTime":6.8,"color":"#795548"}, {"name":"C-3PO","screenTime":5.4,"color":"#f1c40f"}, {"name":"R2-D2","screenTime":5.1,"color":"#3498db"}, {"name":"Anakin Skywalker","screenTime":7.3,"color":"#e67e22"}, {"name":"Palpatine","screenTime":6.5,"color":"#c0392b"}, {"name":"Padmé Amidala","screenTime":5.9,"color":"#8e44ad"}, {"name":"Qui-Gon Jinn","screenTime":4.2,"color":"#16a085"}, {"name":"Mace Windu","screenTime":3.8,"color":"#9b59b6"}, {"name":"Lando Calrissian","screenTime":3.5,"color":"#f39c12"}, {"name":"Boba Fett","screenTime":2.7,"color":"#7f8c8d"}, {"name":"Jabba the Hutt","screenTime":2.1,"color":"#1abc9c"}, {"name":"Count Dooku","screenTime":2.9,"color":"#c0392b"}, {"name":"General Grievous","screenTime":2.4,"color":"#bdc3c7"}, {"name":"Jar Jar Binks","screenTime":1.7,"color":"#d35400"} ]}` }
]

onMounted(() => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  accessKey.value = urlParams.get('accessKey') || localStorage.getItem("accessKey") || '';
  accessSecretKey.value = urlParams.get('accessSecretKey') || localStorage.getItem("accessSecretKey") || '';
  promptId.value = urlParams.get('promptId') || localStorage.getItem("promptId") || '';
  jsonInput.value = localStorage.getItem("jsonInput") || '';
});

const updateJsonInput = () => {
  jsonInput.value = selectedSample.value;
};

const generatePieChart = async () => {
  if (!accessKey.value || !accessSecretKey.value || !promptId.value || !jsonInput.value) {
    Swal.fire("Error", "All inputs are required.", "error");
    return;
  }

  try {
    JSON.parse(jsonInput.value);
  } catch (e) {
    Swal.fire("Error", "JSON input is not valid.", "error");
    return;
  }

  loading.value = true;
  localStorage.setItem('accessKey', accessKey.value);
  localStorage.setItem('accessSecretKey', accessSecretKey.value);
  localStorage.setItem('promptId', promptId.value);
  localStorage.setItem('jsonInput', jsonInput.value);

  let chartInput = "";
  try {
    chartInput = await invokeFlow();
    renderPieChart(chartInput);
  } catch (error) {
    console.error(`AI Response: '${chartInput}'`);
    console.error("Error generating pie chart:", error);
    Swal.fire("Error", "Failed to generate pie chart. Check the console for more details", "error");
  } finally {
    loading.value = false;
  }
};

const invokeFlow = async (): Promise<string> => {
  const inputs = [
    {
      content: { document: jsonInput.value },
      nodeName: "FlowInputNode",
      nodeOutputName: "document",
    },
  ];

  const bedrockClient = new BedrockAgentRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: accessKey.value,
      secretAccessKey: accessSecretKey.value,
    },
  });

  const command = new InvokeFlowCommand({
    flowIdentifier: "5YIPQQ37SV",
    flowAliasIdentifier: "02XWAF9CP3",
    inputs,
  });

  let chartInput = "";

  try {
    let flowResponse: any = {};
    const response = await bedrockClient.send(command);

    if (response && response.responseStream) {
      for await (const chunkEvent of response.responseStream) {
        const { flowOutputEvent, flowCompletionEvent } = chunkEvent;

        if (flowOutputEvent) {
          flowResponse = { ...flowResponse, ...flowOutputEvent };
          chartInput = flowResponse?.content?.document;
          console.log(`Chart Input = '${chartInput}'`);
        } else if (flowCompletionEvent) {
          if (flowCompletionEvent.completionReason == 'SUCCESS') {
            console.log(`flowCompletionEvent: Success`);
          } else {
            //log(`flowCompletionEvent: ${flowCompletionEvent}`, true);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  return (chartInput);
};

const renderPieChart = (chartConfigString: string) => {
  if (myChart.value) myChart.value.destroy();
  let chartConfig = JSON.parse(chartConfigString);
  if (pieChartCanvas.value) {
    pieChartCanvas.value.innerHTML = "";
    const ctx = pieChartCanvas.value.getContext('2d');
    if (ctx) {
      myChart.value = new Chart(ctx, chartConfig);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>