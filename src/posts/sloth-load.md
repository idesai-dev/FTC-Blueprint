---
title: Sloth Load
date: 2026-03-28
description: High-speed code deployment and hot-reloading for FTC using Sloth.
tags: [software, beginner, tools]
author: Ishaan Desai
published: true
---

Sloth is a game-changing tool for FTC development that allows for specialized "hot-reloading" of your code. Instead of waiting 30-60 seconds for a full Gradle build and upload, Sloth can push changes to your robot in under a second.

## Why Use Sloth?
- **Speed:** Instant deployments mean you can iterate on PID values or autonomous paths much faster.
- **Efficiency:** No more staring at the progress bar in Android Studio.
- **Reliability:** Developed by the Dairy Foundation, it's designed specifically for the unique constraints of the Control Hub.

## Installation
Sloth is typically installed as a Gradle plugin in your `build.gradle` file.