#!/bin/bash  

# Before run this script, you need to login your docker and kubectl with correct access right
IMAGE_REPO=gcr.io/newtype-dev/at-client-acccount-service-test
IMAGE_TAG=1.0.11-local
HELM_CHART_NAME=at-client-acccount-service-test

docker build ./ -t "$IMAGE_REPO:$IMAGE_TAG"
docker push "$IMAGE_REPO:$IMAGE_TAG"
helm upgrade $HELM_CHART_NAME ./helm/at-client-account-service/ -i -f ./helm/at-client-account-service/values.test.yaml --debug --reuse-values --namespace test --set image.repository=$IMAGE_REPO --set image.tag=$IMAGE_TAG