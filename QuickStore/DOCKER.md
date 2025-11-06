# QuickStore Docker Deployment Guide

Quick guide for deploying QuickStore using Docker.

## Quick Start

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose (optional, for easier management)

### Build and Run

#### Option 1: Using Docker directly
```bash
# Build the image
docker build -t quickstore:latest .

# Run the container
docker run -d -p 8080:80 --name quickstore-app quickstore:latest
```

#### Option 2: Using Docker Compose (Recommended)
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Access the Application

Once running, access QuickStore at:
- **Local**: http://localhost:8080
- **Network**: http://your-server-ip:8080

## Docker Commands

### Build
```bash
docker build -t quickstore:latest .
```

### Run
```bash
docker run -d -p 8080:80 --name quickstore-app quickstore:latest
```

### Stop
```bash
docker stop quickstore-app
```

### Remove
```bash
docker rm quickstore-app
```

### View Logs
```bash
docker logs -f quickstore-app
```

### Restart
```bash
docker restart quickstore-app
```

## Docker Compose Commands

### Start
```bash
docker-compose up -d
```

### Stop
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Rebuild
```bash
docker-compose up -d --build
```

## Custom Port

To use a different port (e.g., 3000):

```bash
docker run -d -p 3000:80 --name quickstore-app quickstore:latest
```

Or update `docker-compose.yml`:
```yaml
ports:
  - "3000:80"
```

## Production Deployment

### 1. Build for Production
```bash
docker build -t quickstore:latest .
```

### 2. Tag for Registry
```bash
docker tag quickstore:latest your-registry/quickstore:latest
```

### 3. Push to Registry
```bash
docker push your-registry/quickstore:latest
```

### 4. Deploy to Server
```bash
docker pull your-registry/quickstore:latest
docker run -d -p 80:80 --name quickstore-app --restart unless-stopped quickstore:latest
```

## Health Check

The container includes a health check endpoint:
- **URL**: http://localhost:8080/health
- **Response**: `healthy`

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs quickstore-app

# Check if port is in use
netstat -tulpn | grep 8080
```

### Permission denied
```bash
# Run with sudo (Linux)
sudo docker run -d -p 8080:80 --name quickstore-app quickstore:latest
```

### Port already in use
```bash
# Use a different port
docker run -d -p 3000:80 --name quickstore-app quickstore:latest
```

### Rebuild after changes
```bash
# Stop and remove
docker stop quickstore-app
docker rm quickstore-app

# Rebuild
docker build -t quickstore:latest .

# Run again
docker run -d -p 8080:80 --name quickstore-app quickstore:latest
```

## Environment Variables

Currently, the app uses hardcoded Back4App credentials in `config.js`. To use environment variables:

1. Modify `Dockerfile` to accept environment variables
2. Update `config.js` to read from environment variables
3. Pass variables when running:
```bash
docker run -d -p 8080:80 \
  -e PARSE_APP_ID=your_app_id \
  -e PARSE_JS_KEY=your_key \
  --name quickstore-app \
  quickstore:latest
```

## Multi-Architecture Support

To build for different architectures:

```bash
# Build for ARM64 (Apple Silicon, Raspberry Pi)
docker buildx build --platform linux/arm64 -t quickstore:arm64 .

# Build for AMD64 (Intel/AMD)
docker buildx build --platform linux/amd64 -t quickstore:amd64 .
```

## Security Considerations

1. **Don't expose port 80 directly** - Use a reverse proxy (nginx, traefik)
2. **Use HTTPS** - Configure SSL/TLS certificates
3. **Limit resources** - Set memory and CPU limits:
```bash
docker run -d -p 8080:80 \
  --memory="512m" \
  --cpus="1.0" \
  --name quickstore-app \
  quickstore:latest
```

## Scaling

For production, consider:
- Using a container orchestration platform (Kubernetes, Docker Swarm)
- Setting up a load balancer
- Using a reverse proxy (nginx, traefik)
- Implementing health checks and auto-restart

---

**Happy Dockerizing! 🐳**

