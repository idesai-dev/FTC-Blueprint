const r=`---\r
title: Pedro Pathing Introduction\r
date: 2026-03-28\r
description: A powerful path-following library for FTC.\r
tags: [software, intermediate, autonomous]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
# Introduction to Pedro Pathing\r
\r
Pedro Pathing is a library designed to provide smooth, efficient path-following for FTC robots. It is particularly known for its ability to handle complex paths with ease and its integration with modern sensors like the Pinpoint Odometry Computer.\r
\r
## Key Features\r
- **Bezier Curves:** Uses Bezier curves for smooth path planning.\r
- **Asynchronous Execution:** Runs path following in the background, allowing for simultaneous actions.\r
- **Sensor Integration:** Native support for Pinpoint and other odometry sensors.\r
- **Customizable:** Highly configurable for different drivetrain types and sensor setups.\r
\r
## Getting Started\r
To use Pedro Pathing, you typically need to:\r
1.  Add the library to your \`build.gradle\`.\r
2.  Configure your robot's hardware in a dedicated \`Hardware\` class.\r
3.  Initialize the \`Follower\` class with your constants and hardware settings.\r
\r
### Basic Setup Example\r
\r
\`\`\`java\r
public class PedroInit {\r
    public Follower follower;\r
\r
    public void init(HardwareMap hwMap) {\r
        // Initialize the follower with your robot's constants\r
        follower = new Follower(hwMap);\r
        \r
        // Set the starting position of the robot\r
        follower.setStartingPose(new Pose(0, 0, Math.toRadians(0)));\r
    }\r
}\r
\`\`\`\r
\r
## Why Choose Pedro?\r
Pedro Pathing offers a unique balance of performance and ease of use. It is especially effective for teams that want sophisticated autonomous routines without the overhead of building their own path-following logic from scratch.\r
`;export{r as default};
