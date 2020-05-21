locals {
  app_name = "console"
  config_file_path = "${path.module}/templates/console_json.tpl"
  deployment_yaml_file_path = "${path.module}/templates/deployment_yaml.tpl"
  count = "${var.enabled?1:0}"
  checksum = "${sha1("${data.template_file.config_data.rendered}")}"
  configmap_name = "console-${local.checksum}"
  haystack_console_cname = "${local.app_name}.${var.haystack_cluster_name}.${var.haystack_domain_name}"
}

resource "kubernetes_config_map" "haystack-config" {
  metadata {
    name = "${local.configmap_name}"
    namespace = "${var.namespace}"
  }
  data {
    "console.json" = "${data.template_file.config_data.rendered}"
  }
  count = "${local.count}"

}

data "template_file" "config_data" {
  template = "${file("${local.config_file_path}")}"

  vars {
    attributor_endpoint = "${var.attributor_endpoint}"
    influxdb_endpoint_host = "${var.influxdb_endpoint_host}"
    influxdb_endpoint_port = "${var.influxdb_endpoint_port}"
    grafana_endpoint = "${var.grafana_endpoint}"
    healthcheckthreshold_trends_iteratorAgeSeconds = "${var.healthcheckthreshold_trends_iteratorAgeSeconds}"
    healthcheckthreshold_traces_iteratorAgeSeconds = "${var.healthcheckthreshold_traces_iteratorAgeSeconds}"
    healthcheckthreshold_service-graph_iteratorAgeSeconds = "${var.healthcheckthreshold_service-graph_iteratorAgeSeconds}"
    healthcheckthreshold_collector_iteratorAgeSeconds = "${var.healthcheckthreshold_collector_iteratorAgeSeconds}"
    attributorAdditionalTags = "${var.attributorAdditionalTags}"
  }
}

data "template_file" "deployment_yaml" {
  template = "${file("${local.deployment_yaml_file_path}")}"
  vars {
    app_name = "${local.app_name}"
    namespace = "${var.namespace}"
    node_selecter_label = "${var.node_selector_label}"
    image = "${var.image}"
    replicas = "${var.replicas}"
    memory_limit = "${var.memory_limit}"
    memory_request = "${var.memory_request}"
    jvm_memory_limit = "${var.jvm_memory_limit}"
    cpu_limit = "${var.cpu_limit}"
    cpu_request = "${var.cpu_request}"
    service_port = "${var.service_port}"
    container_port = "${var.container_port}"
    configmap_name = "${local.configmap_name}"
    env_vars= "${indent(9,"${var.env_vars}")}"
    haystack_console_cname = "${local.haystack_console_cname}"
  }
}

resource "null_resource" "kubectl_apply" {
  triggers {
    template = "${data.template_file.deployment_yaml.rendered}"
  }
  provisioner "local-exec" {
    command = "echo '${data.template_file.deployment_yaml.rendered}' | ${var.kubectl_executable_name} apply -f - --context ${var.kubectl_context_name}"
  }
  count = "${local.count}"
}


resource "null_resource" "kubectl_destroy" {

  provisioner "local-exec" {
    command = "echo '${data.template_file.deployment_yaml.rendered}' | ${var.kubectl_executable_name} delete -f - --context ${var.kubectl_context_name}"
    when = "destroy"
  }
  count = "${local.count}"
}
