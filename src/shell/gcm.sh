#!/bin/bash

function gcm() {
    # the environment the user wants to set
    local ENVIRONMENT_NAME=$1

    # output
    echo 'Switching to the environment: ' $ENVIRONMENT_NAME
}