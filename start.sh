#!/bin/bash
prompt_install() {
    read -p "$1 (y/n, default y): " response
    response=${response:-y}
    if [[ "$response" =~ ^[Yy]$ ]]
    then
        return 0
    else
        return 1
    fi
}
if ! command -v bun &> /dev/null
then
    echo "'bun' command not found. Installing 'bun'..."
    if ! command -v curl &> /dev/null
    then
        echo "'curl' is not installed."
        if prompt_install "Do you want to install 'curl'?"
        then
            sudo apt-get install -y curl
        else
            echo "Please install 'curl' and try again."
            exit 1
        fi
    fi
    if ! command -v unzip &> /dev/null
    then
        echo "'unzip' is not installed."
        if prompt_install "Do you want to install 'unzip'?"
        then
            sudo apt-get install -y unzip
        else
            echo "Please install 'unzip' and try again."
            exit 1
        fi
    fi
    curl -fsSL https://bun.sh/install | bash
    source ~/.bashrc
    echo "'bun' installation completed."
else
    echo "'bun' is already installed."
fi
echo "Creating build folder structure..."
if [ -d "build" ]; then
    rm -rf build
fi
echo "Building project..."
bun install
bun run index.ts
if [ -d "temp" ]; then
    mkdir -p build
    unzip temp/client.zip -d build/client
    unzip temp/server.zip -d build/server
    rm -rf temp
    echo "Install dependencies..."
    cd build/server
    bun install
    cd ../client
    bun install
    cd ../../
    cp client/.env build/client/.env
    cp server/.env build/server/.env
    echo "Starting project..."
    bun --filter 'build/*' preview
else
    echo Starting project...
    bun --filter "*" preview
fi
