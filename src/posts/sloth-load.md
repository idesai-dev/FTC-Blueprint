---
title: Sloth Load
date: 2026-03-28
description: High-speed code deployment and hot-reloading for FTC using Sloth.
tags: [completed, software, beginner, tools]
author: Ishaan Desai
published: true
---


# Sloth Load


Sloth is a game-changing tool for FTC development that allows for specialized "hot-reloading" of your code. Instead of waiting 30-60 seconds for a full Gradle build and upload, Sloth can push changes to your robot in under a second.


<br>


---


<br>


## Why Use Sloth?


- **Speed:** Instant deployments mean you can iterate on PID values or autonomous paths much faster.
- **Efficiency:** No more staring at the progress bar in Android Studio.
- **Reliability:** Developed by the Dairy Foundation, it's designed specifically for the unique constraints of the Control Hub.


<br>


---


<br>


## Installation


Sloth is typically installed as a Gradle plugin in your `build.gradle` file.


```gradle
plugins {
    id "com.dairy.sloth" version "1.2.0"
}
```


<br>


---


<br>


## Usage


Once installed, you can use the `sloth` command or the Android Studio integration to push your changes instantly.


> [!IMPORTANT]
> Ensure your robot is connected via ADB (Wi-Fi or USB) for the fastest results.
