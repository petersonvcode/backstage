#!/bin/bash

set -e

BACKEND_IP=72.62.106.70
SSH_KEY=~/.ssh/hostinger_vps
SSH_USER=root
SSH_PORT=50022

yarn tsc

yarn build:backend

docker image build . -f packages/backend/Dockerfile --tag backstage

docker image save backstage -o backstage.tar
clean_image_tar() {
        rm -f backstage.tar
}
trap clean_image_tar EXIT

gzip backstage.tar
clean_image_gz() {
        rm -f backstage.tar.gz
}
trap clean_image_gz EXIT

ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$BACKEND_IP "docker stop backstage" || true
ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$BACKEND_IP "docker rm backstage" || true
ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$BACKEND_IP "docker image rm backstage" || true
ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$BACKEND_IP "rm -f /root/backstage/backstage.tar.gz /root/backstage/backstage.tar" || true
scp -i $SSH_KEY -p $SSH_PORT backstage.tar.gz $SSH_USER@$BACKEND_IP:/root/backstage/backstage.tar.gz
ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$BACKEND_IP "cd /root/backstage && gzip -d backstage.tar.gz && docker load -i backstage.tar"
ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$BACKEND_IP "docker run -d --name backstage -p 7007:7007 backstage"
