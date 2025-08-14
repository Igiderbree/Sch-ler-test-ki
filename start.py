#!/usr/bin/env python3
"""Convenience script to launch the development server."""
import subprocess
import sys

if __name__ == "__main__":
    try:
        subprocess.run(["node", "server.js"], check=True)
    except FileNotFoundError:
        sys.exit("Node.js is required to run the server. Please install it and try again.")
    except subprocess.CalledProcessError as exc:
        sys.exit(exc.returncode)
