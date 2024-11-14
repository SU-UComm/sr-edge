#!/bin/zsh

setopt nullglob

DIST_DIR="dist"
GLOBAL_DIR="$DIST_DIR/global/"

# Reusable function to process a component directory
process_component() {
    local COMPONENT_DIR=$1
    local HTML_FILE=$2

    echo "Transforming $HTML_FILE..."
    
    if [[ -d "$COMPONENT_DIR" && "$COMPONENT_DIR" != "$GLOBAL_DIR" ]]; then
        CSS_FILE="${DIST_DIR}/global/bundle.css"
        JS_FILE="${COMPONENT_DIR}scripts.js"

        # Check if style.css file exist
        if [[ -f "$HTML_FILE" && -f "$CSS_FILE" ]]; then
            # Read style content
            CSS_CONTENT=$(<"$CSS_FILE")

            # Insert CSS content into <style> tag
            sed -i.bak "/\[\[inline-styles\]\]/ {
                r /dev/stdin
                d
            }" "$HTML_FILE" <<< "<style>${CSS_CONTENT}</style>"

            echo " ✓ $CSS_FILE"

            # Remove tha bak file for HTML
            rm "${HTML_FILE}.bak"
        # else
            # echo "No HTML or CSS file in directory $COMPONENT_DIR"
        fi

        # Check if scripts.js file exist
        if [[ -f "$HTML_FILE" && -f "$JS_FILE" ]]; then
            # Read scripts content
            JS_CONTENT=$(<"$JS_FILE")

              # Escape special characters in JS content for sed
            ESCAPED_JS_CONTENT=$(printf '%s\n' "$JS_CONTENT" | sed 's/[&/\]/&/g')

            # Insert JS content into <script> tag
            sed -i.bak "/\[\[inline-scripts\]\]/ {
                r /dev/stdin
                d
            }" "$HTML_FILE" <<< "<script type='module'>${ESCAPED_JS_CONTENT}</script>"

            echo " ✓ $JS_FILE"

            # Remove tha bak file for HTML
            rm "${HTML_FILE}.bak"
        # else
            # echo "No HTML or JS file in directory $COMPONENT_DIR"
        fi
    fi
    echo ""
}

# Check if any .html files exist in COMPONENT_DIR or COMPONENT_DIR/previews
if ls "$DIST_DIR"/*/*.html "$DIST_DIR"/*/previews/*.html 1> /dev/null 2>&1; then
    echo "HTML files found. Proceeding..."

    # Loop through each component directory in DIST_DIR
    for COMPONENT_DIR in "$DIST_DIR"/*/; do

        if ls "$COMPONENT_DIR"/*.html 1> /dev/null 2>&1; then
            # First, check for .html files in COMPONENT_DIR/*.html
            for HTML_FILE in "$COMPONENT_DIR"/*.html; do
                # Ensure the HTML file exists before calling process_component
                if [ -f "$HTML_FILE" ]; then
                    process_component "$COMPONENT_DIR" "$HTML_FILE"
                fi
            done
        fi

        if ls "$COMPONENT_DIR"/previews/*.html 1> /dev/null 2>&1; then
            # Then, check for .html files in COMPONENT_DIR/previews/*.html
            for HTML_FILE in "$COMPONENT_DIR"/previews/*.html; do
                # Ensure the HTML file exists before calling process_component
                if [ -f "$HTML_FILE" ]; then
                    process_component "$COMPONENT_DIR" "$HTML_FILE"
                fi
            done
        fi

    done

else
    echo "No HTML files found. Exiting..."
    exit 1
fi