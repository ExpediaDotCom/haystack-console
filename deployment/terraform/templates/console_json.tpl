{
  "port": 8080,
  "upstreamTimeout": 20000,
  "attributorEndpoint": "http://${attributor_endpoint}",
  "monitoringInfluxdbEndpoint": "http://${influxdb_endpoint_host}:${influxdb_endpoint_port}",
  "healthCheckthresholds": {
    "subsystems": {
      "trends": { "iteratorAgeSeconds": ${healthcheckthreshold_trends_iteratorAgeSeconds} },
      "traces": { "iteratorAgeSeconds": ${healthcheckthreshold_traces_iteratorAgeSeconds} },
      "service-graph": { "iteratorAgeSeconds": ${healthcheckthreshold_service-graph_iteratorAgeSeconds} },
      "collector": { "iteratorAgeSeconds": ${healthcheckthreshold_collector_iteratorAgeSeconds} }
    }
  },
  "grafanaHost": "${grafana_endpoint}",
  "attributorAdditionalTags" : ${attributorAdditionalTags}
}