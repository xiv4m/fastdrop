#!/usr/bin/env python3
"""Setup script for FastDrop."""

from setuptools import setup, find_packages
import os

here = os.path.abspath(os.path.dirname(__file__))

with open(os.path.join(here, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="fastdrop",
    version="0.1.0",
    author="XIV4M (Shivam)",
    description="Ultra-lightweight, zero-dependency file and text sharing server with modern web UI, streaming transfers, authentication, and built-in code editor.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/XIV4M/fastdrop",
    packages=find_packages(),
    include_package_data=True,
    package_data={
        "fastdrop": ["web/*"],
    },
    entry_points={
        "console_scripts": [
            "fastdrop = fastdrop.cli:main",
        ],
    },
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Environment :: Console",
        "Environment :: Web Environment",
        "Intended Audience :: Developers",
        "Intended Audience :: End Users/Desktop",
        "Intended Audience :: System Administrators",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: Python :: 3.13",
        "Programming Language :: Python :: 3.14",
        "Topic :: Communications :: File Sharing",
        "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
        "Topic :: System :: Networking",
        "Topic :: Utilities",
    ],
)
