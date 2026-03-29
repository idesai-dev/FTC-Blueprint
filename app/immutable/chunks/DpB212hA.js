const n=`---\r
title: Pedro Pathing: How to Tune\r
date: 2026-03-28\r
description: Step-by-step guide to tuning your robot for Pedro Pathing.\r
tags: [software, intermediate, autonomous]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
# Tuning Your Robot for Pedro Pathing\r
\r
Tuning is the most critical part of setting up Pedro Pathing. A well-tuned robot will follow paths with high precision, while a poorly tuned one will struggle.\r
\r
## The Tuning Process\r
\r
### 1. Drivetrain Tuning\r
- **Max Velocity:** Find the maximum speed your robot can achieve while maintaining control.\r
- **Acceleration:** Find the maximum acceleration the robot should use for smooth movements.\r
\r
### 2. Odometry Calibration\r
- **Encoder Resolution:** Ensure your odometry pods are providing the correct number of pulses per unit of distance.\r
- **Track Width:** Precisely measure the physical distance between your tracking wheels.\r
\r
### 3. PID and Feedforward Tuning\r
- **Follower PID:** Tune the PID controllers within Pedro to maintain path accuracy.\r
- **Feedforward Constants:** Find the *K_s*, *K_v*, and *K_a* values for your drivetrain motors.\r
\r
## Using Panels\r
Pedro Pathing includes a built-in dashboard for real-time tuning and visualization. \r
\r
1.  Connect to your robot's Control Hub via Wi-Fi.\r
2.  Open the Pedro Dashboard in your web browser.\r
3.  Use the tuning tools to adjust constants and see the robot's performance live.\r
\r
## Common Issues\r
- **Overshooting:** Increase $K_d$ or decrease $K_p$ in your follower PID.\r
- **Inconsistent Paths:** Check your odometry hardware for any mechanical issues.\r
- **Slow Response:** Increase your $K_p$ or $K_v$ values.\r
`;export{n as default};
