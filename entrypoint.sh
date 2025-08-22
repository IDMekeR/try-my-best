#!/bin/sh

# Generate env-config.js at runtime
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = {
  API_URL: "${API_URL}",
};
EOF

# Start Nginx
exec "$@"
