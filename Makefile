.PHONY: clean build docker_build all release

# docker namespace
export DOCKER_ORG := expediadotcom
export DOCKER_IMAGE_NAME := haystack-console

clean:
	npm run clean

install:
	npm install

build: clean install
	CI=false npm run build

docker_build:
	docker build -t $(DOCKER_IMAGE_NAME) -f Dockerfile .

all: build docker_build

# build all and release
release: 
	./deployment/scripts/publish-to-docker-hub.sh
