#!/bin/bash
# Simple script to create placeholder PNG icons using ImageMagick

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found, installing..."
    apt-get update -qq && apt-get install -y -qq imagemagick > /dev/null 2>&1
fi

# Create icons with different sizes
for size in 16 32 48 128; do
    convert -size ${size}x${size} xc:transparent \
        -fill '#9147ff' -draw "circle $(($size/2)),$(($size/2)) $(($size/2)),$(($size/4))" \
        -fill white -pointsize $(($size/2)) -gravity center -annotate +0+0 "T" \
        icon${size}.png 2>/dev/null || echo "Could not create icon${size}.png"
done

echo "Icons created successfully"
