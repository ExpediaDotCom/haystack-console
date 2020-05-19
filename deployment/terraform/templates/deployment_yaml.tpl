# ------------------- Deployment ------------------- #

kind: Deployment
apiVersion: apps/v1beta2
metadata:
  labels:
    k8s-app: ${app_name}
  name: ${app_name}
  namespace: ${namespace}
spec:
  replicas: ${replicas}
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: ${app_name}
  template:
    metadata:
      labels:
        k8s-app: ${app_name}
    spec:
      containers:
      - name: ${app_name}
        image: ${image}
        volumeMounts:
          # Create on-disk volume to store exec logs
        - mountPath: /config
          name: config-volume
        resources:
          limits:
            cpu: ${cpu_limit}
            memory: ${memory_limit}Mi
          requests:
            cpu: ${cpu_request}
            memory: ${memory_request}Mi
        env:
        - name: "HAYSTACK_OVERRIDES_CONFIG_PATH"
          value: "/config/console.json"
        ${env_vars}
      imagePullSecrets:
        - name: regcred
      nodeSelector:
        ${node_selecter_label}
      volumes:
      - name: config-volume
        configMap:
          name: ${configmap_name}

# ------------------- Service ------------------- #
---
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: ${app_name}
  name: ${app_name}
  namespace: ${namespace}
spec:
  ports:
  - port: ${service_port}
    targetPort: ${container_port}
  selector:
    k8s-app: ${app_name}
  clusterIP: None

# ------------------- Ingress Rule ------------------- #
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: traefik-haystack-${app_name}
  namespace: ${namespace}
  annotations:
    kubernetes.io/ingress.class: traefik
spec:
  rules:
  - host: ${haystack_console_cname}
    http:
      paths:
      - path: /
        backend:
          serviceName: ${app_name}
          servicePort: ${service_port}


