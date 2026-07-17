---
id: nginx
title: NGINX
sidebar_label: NGINX
sidebar_position: 1
tags: [nginx, web-server, reverse-proxy, devops, infrastructure]
---

## What It Is

NGINX (pronounced "engine-x") is a high-performance web server, reverse proxy, load balancer, and HTTP cache. Originally built by Igor Sysoev to solve the [C10k problem](https://en.wikipedia.org/wiki/C10k_problem) (handling 10,000+ concurrent connections), it uses an **event-driven, asynchronous architecture** instead of Apache's traditional thread/process-per-connection model — which is why it uses far less memory under heavy load.

Two flavors exist:
- **nginx open source** — what most people mean by "NGINX."
- **NGINX Plus** — commercial version with extras like active health checks, session persistence, and a dashboard.

## Core Architecture

- **Master process** — reads config, binds to ports, manages worker processes. Runs as root (needed to bind low ports like 80/443).
- **Worker processes** — do the actual work: accepting connections, reading/writing data. Run as an unprivileged user (e.g. `www-data` / `nginx`).
- **Worker connections** — each worker can handle thousands of connections concurrently via an event loop (epoll on Linux), not one thread per connection.

Rule of thumb: `worker_processes` = number of CPU cores (or `auto` to let NGINX decide).

## Installation & Service Basics

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install nginx

# RHEL/CentOS/Fedora
sudo dnf install nginx

# Service management
sudo systemctl start nginx
sudo systemctl enable nginx     # start on boot
sudo systemctl reload nginx     # reload config without dropping connections
sudo systemctl restart nginx    # full restart (drops connections)

# Test config syntax before reloading — always do this
sudo nginx -t

# Check version + compiled modules
nginx -V
```

`reload` vs `restart` matters: **reload** spawns new workers with the new config and gracefully phases out old ones (zero downtime). **restart** kills everything and starts fresh.

## File Layout (Debian/Ubuntu convention)

```
/etc/nginx/
├── nginx.conf              # main config, sets global directives, includes everything else
├── conf.d/                 # drop-in configs, auto-included via `include conf.d/*.conf;`
├── sites-available/        # server block definitions (not active until linked)
├── sites-enabled/          # symlinks into sites-available — these are what's actually loaded
├── snippets/                # reusable config fragments (e.g. SSL params)
└── mime.types

/var/log/nginx/
├── access.log
└── error.log

/var/www/html/              # default document root
```

Enable a site:
```bash
sudo ln -s /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

RHEL-based systems typically skip `sites-available`/`sites-enabled` and just use `conf.d/*.conf` directly.

## Config Structure — Contexts

NGINX config is a nested tree of **contexts** (blocks). Directives set in a parent context are inherited by children unless overridden.

```
main                  # global settings: worker_processes, user, error_log
└── events             # connection processing: worker_connections
└── http               # anything HTTP-related lives here
    └── server         # a "virtual host" — one server block per site/domain
        └── location   # routing rules within a server, matched against the URI
```

There's also a `stream` context (sibling of `http`) for raw TCP/UDP proxying (e.g. proxying a database or a non-HTTP service).

## A Basic Server Block

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    root /var/www/example.com/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
```

- `listen` — port (and optionally IP) to bind.
- `server_name` — which `Host:` header this block responds to. NGINX picks the *most specific* match; a block with no matching `server_name` falls back to the first one defined (or one marked `default_server`).
- `root` — filesystem path documents are served from.
- `try_files` — checks candidates in order, serves the first that exists, falls through to the last argument (often a `=404` or a rewrite) if none match.

## `location` Block Matching

Order of precedence (highest to lowest), **not** the order they appear in the file:

| Syntax | Meaning |
|---|---|
| `location = /path` | Exact match |
| `location ^~ /path` | Prefix match, stop checking regex if matched |
| `location ~ /path` | Case-sensitive regex |
| `location ~* /path` | Case-insensitive regex |
| `location /path` | Prefix match (checked only if no regex matched) |

```nginx
location = /favicon.ico { log_not_found off; access_log off; }
location ~* \.(jpg|jpeg|png|gif|css|js)$ { expires 30d; }
location /api/ { proxy_pass http://backend; }
```

## Reverse Proxy

The single most common NGINX use case: sitting in front of an app server (Node, Django, Rails, etc.) and forwarding requests to it.

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        # forward real client info to the backend — the app sees NGINX's
        # IP by default without these
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Gotcha:** if `proxy_pass` target has a URI path and the `location` also has a path, NGINX does path replacement in a way that trips people up constantly:

```nginx
# location has trailing slash + proxy_pass has trailing slash + path
# => /api/foo becomes /foo on the backend (the /api/ prefix is stripped)
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
}

# no trailing slash on proxy_pass => /api/foo stays /api/foo on the backend
location /api/ {
    proxy_pass http://127.0.0.1:3000;
}
```

## Load Balancing

```nginx
upstream backend {
    least_conn;                      # algorithm — default is round-robin
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000 backup;     # only used if others are down
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

Common algorithms: `round_robin` (default, no directive needed), `least_conn` (fewest active connections), `ip_hash` (same client always hits same backend — useful for sticky sessions without shared session storage).

Health awareness (open source): passive only — a server is marked down after failed attempts (`max_fails`, `fail_timeout`). Active health checks are an NGINX Plus feature.

## TLS / HTTPS (Let's Encrypt via Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
# certbot edits the server block and adds a renewal cron/systemd timer automatically
```

Resulting block roughly looks like:

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com www.example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;

    # ... rest of config
}

# redirect HTTP -> HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}
```

Test renewal without waiting for expiry:
```bash
sudo certbot renew --dry-run
```

## Caching

Two different kinds of "caching" people conflate:

**1. Static asset caching (browser cache headers)**
```nginx
location ~* \.(css|js|jpg|png|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**2. Proxy caching (NGINX caches upstream responses on disk)**
```nginx
# in http context
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

server {
    location / {
        proxy_pass http://backend;
        proxy_cache my_cache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        add_header X-Cache-Status $upstream_cache_status;  # HIT / MISS / BYPASS — great for debugging
    }
}
```

## Rate Limiting

```nginx
# http context — define the zone (shared memory bucket)
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    location /login {
        limit_req zone=mylimit burst=20 nodelay;
    }
}
```

`rate` = sustained requests/sec allowed per key (here, per client IP). `burst` = how many requests can queue above the rate before being rejected. `nodelay` processes burst requests immediately instead of throttling them artificially.

## Gzip Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 256;
```

## Useful Built-in Variables

| Variable | Meaning |
|---|---|
| `$host` | Host header (or server_name if absent) |
| `$remote_addr` | client IP |
| `$request_uri` | full original URI including query string |
| `$uri` | normalized URI (no query string) |
| `$scheme` | `http` or `https` |
| `$args` | query string |
| `$status` | response status code (in logging) |
| `$upstream_response_time` | time backend took to respond — useful for perf debugging |

## Logging

```nginx
log_format custom '$remote_addr - $host [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   'rt=$request_time uct=$upstream_connect_time urt=$upstream_response_time';

access_log /var/log/nginx/access.log custom;
error_log  /var/log/nginx/error.log warn;   # levels: debug, info, notice, warn, error, crit
```

Tail logs live while debugging:
```bash
sudo tail -f /var/log/nginx/error.log
```

## Common Gotchas / Things That Bit Me

- **Forgetting `nginx -t` before reload** — a syntax error means the reload silently fails and the *old* config keeps running; you think you deployed a change and you didn't.
- **`root` inside `location` vs `server`** — putting `root` in multiple nested locations can cause confusing path concatenation. Prefer setting it once at `server` level and using `alias` for exceptions.
- **`alias` vs `root`** — `root` appends the full location path to the filesystem path; `alias` replaces it. Mixing them up is a classic 404 source.
- **Missing trailing slash in `proxy_pass`** — see Reverse Proxy section above; silently changes the path forwarded to the backend.
- **Client body size** — big file uploads fail with `413 Request Entity Too Large` until you raise `client_max_body_size` (default is 1MB).
  ```nginx
  client_max_body_size 20M;
  ```
- **WebSockets need explicit upgrade headers** through a reverse proxy:
  ```nginx
  location /ws/ {
      proxy_pass http://backend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
  }
  ```
- **`server_name_in_redirect` / `$host` vs `$http_host`** — redirects can silently leak the wrong hostname if NGINX sits behind another proxy and headers aren't forwarded properly.
- **Default server block** — if no `server_name` matches, NGINX serves whichever block is first (or `listen 80 default_server;`) — this can expose an unintended site to raw-IP requests.

## Security Headers (Quick Reference)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
```

## Handy Commands Cheat Sheet

```bash
nginx -t                      # test config syntax
nginx -T                      # test + dump the fully resolved config
sudo systemctl reload nginx   # zero-downtime config reload
sudo systemctl status nginx   # check it's running
sudo nginx -s reload          # alternative reload method (signal-based)
curl -I https://example.com   # quick header/status check
```

## Further Reading

- [Official NGINX docs](https://nginx.org/en/docs/)
- [NGINX beginner's guide](https://nginx.org/en/docs/beginners_guide.html)
- [Mozilla SSL config generator](https://ssl-config.mozilla.org/) — generates solid `ssl_*` directives for your NGINX version
