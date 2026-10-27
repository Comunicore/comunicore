#!/bin/bash

set -euo pipefail

cd "$( dirname "${BASH_SOURCE[0]}" )"

case "${SSH_ORIGINAL_COMMAND:-}" in
    test)
        exec ./deploy_test.sh test
        exit 0
        ;;
    narzan)
        exec ./deploy_test.sh narzan
        exit 0
        ;;
    barbaris)
        exec ./deploy_test.sh barbaris
        exit 0
        ;;
    *)
	exec ./deploy_production.sh
	exit 0
        ;;
esac
