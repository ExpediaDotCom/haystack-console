const clientConfig = {
  grafanaHost: "https://metrics.haystack.local:32300",
  attributorAdditionalTags: {
    blobsCount: {
      tagDisplayName: "Blobs Count",
      valueType: "COUNT",
    },
    spanOwner: {
      tagDisplayName: "Span Owner",
      valueType: "NONE",
    },
  },
};
const serverConfig = {
  port: 8080,
  upstreamTimeout: 100000,
  attributorEndpoint:
    "https://attributor.haystack-test.test.monitoring.expedia.com/attributor",
  monitoringInfluxdbEndpoint: "http://monitoring-influxdb.kube-system.svc:8086",
  healthCheckthresholds: {
    subsystems: {
      trends: { iteratorAgeSeconds: 300 },
      traces: { iteratorAgeSeconds: 300 },
      ["service-graph"]: { iteratorAgeSeconds: 300 },
      collector: { iteratorAgeSeconds: 300 },
    },
    infrastructure: {
      k8sCluster: { cpuUsage: 0.7, memoryUsage: 0.7 },
      kafka: { cpuUsage: 0.7 },
    },
  },
};

module.exports = { ...clientConfig, ...serverConfig };
