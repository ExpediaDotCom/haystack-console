variable "image" {}
variable "replicas" {}
variable "namespace" {}
variable "enabled" {}
variable "attributor_endpoint" {}
variable "grafana_endpoint" {}
variable "upstreamTimeout" {}
variable "healthcheckthreshold_trends_iteratorAgeSeconds" {}
variable "healthcheckthreshold_traces_iteratorAgeSeconds" {}
variable "healthcheckthreshold_service-graph_iteratorAgeSeconds" {}
variable "healthcheckthreshold_collector_iteratorAgeSeconds" {}
variable "healthcheckthreshold_k8sCluster_cpuUsage" {}
variable "healthcheckthreshold_k8sCluster_memoryUsage" {}
variable "healthcheckthreshold_kafka_cpuUsage" {}


variable "attributorAdditionalTags" {}

variable "influxdb_endpoint_host" {}
variable "influxdb_endpoint_port" {}
variable "kubectl_executable_name" {}
variable "kubectl_context_name" {}
variable "node_selector_label"{}
variable "memory_request"{}
variable "memory_limit"{}
variable "cpu_request"{}
variable "cpu_limit"{}
variable "jvm_memory_limit"{}
variable "env_vars" {}
variable "haystack_cluster_name" {}
variable "haystack_domain_name" {}

variable "termination_grace_period" {
  default = 30
}

variable "service_port" {
  default = 8080
}
variable "container_port" {
  default = 8080
}
