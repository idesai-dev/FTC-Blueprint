const e=`---\r
title: Feedforward Control\r
date: 2026-03-28\r
description: A practical guide to feedforward control for FTC mechanisms.\r
tags: [software, intermediate, control, completed guide]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
Feedforward control is a pro-active way of controlling mechanisms. Unlike PID, which reacts to errors, Feedforward uses a model of the physical system to pre-calculate the power needed to achieve a specific movement.\r
\r
## Why use Feedforward?\r
With PID alone, if you have gravity or friction (like an arm or linear slide), the mechanism will likely sag or drop. You would have to use a high $K_i$ to compensate, which makes the robot slower to respond.\r
\r
Feedforward calculates the exact amount of power needed to maintain a certain position (against gravity) or speed (against friction).\r
\r
### 1. Velocity Feedforward ($K_v$)\r
This is the amount of power needed per unit of velocity.\r
- **Output** = *K_v* × **target velocity**\r
\r
### 2. Static Friction Feedforward ($K_s$)\r
This is the "voltage jump" needed to overcome friction and get the robot moving.\r
- **Output** = *K_s* (sign stays consistent with direction)\r
\r
### 3. Gravity Feedforward ($K_g$)\r
Crucial for arms and slides.\r
- **For a linear slide:** Constant $K_g$ to hold the weight.\r
- **For a rotating arm:** *K_g* × cos(θ) where θ is the arm's angle.\r
\r
## Implementation in FTC\r
\r
Here is how you can implement a standard Feedforward calculation for a linear slide:\r
\r
\`\`\`java\r
public class SlideFeedforward {\r
    private double ks, kg, kv, ka;\r
\r
    public SlideFeedforward(double ks, double kg, double kv, double ka) {\r
        this.ks = ks;\r
        this.kg = kg;\r
        this.kv = kv;\r
        this.ka = ka;\r
    }\r
\r
    public double calculate(double velocity, double acceleration) {\r
        return (ks * Math.signum(velocity)) + kg + (kv * velocity) + (ka * acceleration);\r
    }\r
}\r
\`\`\`\r
\r
## Combined PID and Feedforward\r
In a real FTC robot, you should use **PID + Feedforward**. The Feedforward does the "heavy lifting" by getting you near the target, and the PID handles the small corrections.\r
\r
\`\`\`java\r
double ff_power = feedforward.calculate(target_vel, target_accel);\r
double pid_power = pid.calculate(current_position);\r
\r
motor.setPower(ff_power + pid_power);\r
\`\`\`\r
\r
## Tuning Feedforward\r
If your robot has Roadrunner or Pedro Pathing, they come with built-in tuning tools for $K_s$ and $K_v$ for the drivetrain. For your custom mechanisms, start with $K_s$ (the minimum power to move the mechanism), then $K_v$ (the relation between power and steady velocity), and finally $K_g$ (the power to hold it still).\r
`;export{e as default};
