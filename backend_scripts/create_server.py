#!/usr/bin/env python3
import sys
import json
import subprocess
import os

def create_docker_compose(config):
    if 'dockerCompose' in config:
        return config['dockerCompose']
    else:
        environment_vars = "\n    environment:"
        for env in config.get('environment', []):
            environment_vars += f"\n      {env['key']}: \"{env['value']}\""

        volumes_list = ""
        for vol in config.get('volumes', []):
            volumes_list += f"\n      - {vol}"

        docker_compose_content = f"""
version: '3.8'
services:
  {config.get('name', 'minecraft-server')}:
    image: {config['image']}
    ports:
      - "{config['port']}:{config['port']}"{environment_vars}{volumes_list}
    restart: {config.get('restart', 'unless-stopped')}
"""
        return docker_compose_content

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "Configuration data not provided."}))
        sys.exit(1)

    try:
        config = json.loads(sys.argv[1])
        server_name = config.get('name', 'minecraft-server').replace(" ", "_").lower() # Санитизация имени
        server_dir = f"/opt/minecraft-servers/{server_name}"
        os.makedirs(server_dir, exist_ok=True)

        docker_compose_content = create_docker_compose(config)

        with open(os.path.join(server_dir, 'docker-compose.yml'), 'w') as f:
            f.write(docker_compose_content)

        # Запуск Docker Compose
        process = subprocess.Popen(['docker-compose', 'up', '-d'], cwd=server_dir,
                                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()

        if process.returncode == 0:
            print(json.dumps({"status": "success", "message": f"Сервер {server_name} запущен."}))
        else:
            print(json.dumps({"status": "error", "message": f"Ошибка запуска сервера: {stderr.decode()}"}))

    except json.JSONDecodeError:
        print(json.dumps({"status": "error", "message": "Ошибка декодирования JSON."}))
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == "__main__":
    main()