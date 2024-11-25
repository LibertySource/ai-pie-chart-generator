# 🚀 AI Pie Chart Generator 

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![Node](https://img.shields.io/badge/node-brightgreen)
![AWS](https://img.shields.io/badge/AWS_Bedrock-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

</div>

Harness the power of AWS Bedrock AI to convert a JSON string to a pie chart using [chart.js](https://www.chartjs.org/docs/latest/api/).

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (version 6 or later) or Yarn (version 1.22 or later)
- AWS Bedrock

### Installation

1\. Clone the repository

```bash
   git clone https://github.com/LibertySource/ai-pie-chart-generator 
```

2\. Navigate to the project directory

```bash
   cd ai-pie-chart-generator 
```

3\. Install dependencies:

Using npm:

```bash
   npm install
```

Or using Yarn:

```bash
   yarn install 
```

### Usage

To start the development server, run:

Using npm:

```bash
   npm run dev 
```

Or using Yarn:

```bash
   yarn dev
```

### Configure AWS Bedrock

With AWS Bedrock Builder tools, create a prompt and Flow similar to the following

```text
You will be provided JSON data suitable to be represented in a pie chart. Your task is to create the JSON object below that will generate the pie chart using Chart.js

The response you send will programmatically be used in the following manner:

new Chart(cts, {IMPORTANT: your task is to generate this JSON object})

Be sure to only return the JSON object that will be used in the Chart function previously mentioned.

Here is the input JSON {{data}}

IMPORTANT: do not provide any explantion and make sure the only response is a 100% valid JSON object.
```

Update src/App.vue with the flow identifier and alias.

Create AWS Bedrock Prompt Flow to use above prompt

Open your browser and navigate to `http://localhost:5173` (or the port specified in your configuraiton.)

### Building for Production

To build the application for production, run:

Using npm:

```bash
    npm run build
```

Or using Yarn:

```bash
    yarn build
```

The built files will be in the `dist` directory.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Jeff Holst - jeff@libertysource.com  

Project Link: [https://github.com/LibertySource/ai-pie-chart-generator](https://github.com/LibertySource/ai-pie-chart-generator)