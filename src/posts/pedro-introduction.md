---
title: Pedro Pathing Introduction
date: 2026-03-28
description: A powerful path-following library for FTC.
tags: [software, intermediate, autonomous]
author: Ishaan Desai
published: true
---

# Introduction to Pedro Pathing

Pedro Pathing is a library designed to provide smooth, efficient path-following for FTC robots. It is particularly known for its ability to handle complex paths with ease and its integration with modern sensors like the Pinpoint Odometry Computer.

## Key Features

- **Bezier Curves:** Uses Bezier curves for smooth path planning.
- **Asynchronous Execution:** Runs path following in the background, allowing for simultaneous actions.
- **Sensor Integration:** Native support for Pinpoint and other odometry sensors.
- **Customizable:** Highly configurable for different drivetrain types and sensor setups.

## Getting Started

To use Pedro Pathing, you typically need to:

1.  Add the library to your `build.gradle`.
2.  Configure your robot's hardware in a dedicated `Hardware` class.
3.  Initialize the `Follower` class with your constants and hardware settings.

### Basic Setup Example

```java
public class PedroInit {
    public Follower follower;

    public void init(HardwareMap hwMap) {
        // Initialize the follower with your robot's constants
        follower = new Follower(hwMap);

        // Set the starting position of the robot
        follower.setStartingPose(new Pose(0, 0, Math.toRadians(0)));
    }
}
```

## Why Choose Pedro?

Pedro Pathing offers a unique balance of performance and ease of use. It is especially effective for teams that want sophisticated autonomous routines without the overhead of building their own path-following logic from scratch.
