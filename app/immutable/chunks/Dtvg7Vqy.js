const r=`---\r
title: PID Control\r
date: 2026-03-28\r
description: A comprehensive guide to proportional, integral, and derivative control in FTC.\r
tags: [software, intermediate, control, completed guide]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
<script>\r
    import PIDVisualizer from '$lib/components/PIDVisualizer.svelte';\r
<\/script>\r
\r
PID (Proportional, Integral, Derivative) control is the most common control algorithm used in FTC for precise movements, whether it's for a drivetrain, an arm, or a slide.\r
\r
<div class="tuner-callout">\r
    <p> <strong>Try our new full-page <a href="/simulators/pid">PID Simulator</a></strong> for a deeper understanding of PID!</p>\r
</div>\r
\r
<PIDVisualizer />\r
\r
## The Three Components\r
\r
### 1. Proportional (P)\r
\r
The **Proportional** term is the simplest. It produces an output that is proportional to the current error.\r
\r
- **Error** = Target - Current Position\r
- **Output** = _K_p_ × **Error**\r
\r
If you are far from the target, the output is large. As you get closer, the output decreases.\r
\r
### 2. Integral (I)\r
\r
The **Integral** term accounts for the accumulation of past errors. If the proportional term isn't enough to reach the target (due to friction or gravity), the Integral term will slowly increase the output over time until the target is reached.\r
\r
- **Output** = _K_p_ × **Error** + _K_i_ × Σ **Error** × _dt_\r
\r
### 3. Derivative (D)\r
\r
The **Derivative** term predicts future error based on the current rate of change. It acts as a "brake," dampening the movement to prevent overshoot and oscillations.\r
\r
- **Output** = _K_p_ × **Error** + _K_d_ × _d(Error)/dt_\r
\r
## Implementation in Java\r
\r
Here is a simple PID class you can use in your FTC code:\r
\r
\`\`\`java\r
public class PIDController {\r
    private double Kp, Ki, Kd;\r
    private double target;\r
    private double integralSum = 0;\r
    private double lastError = 0;\r
    private ElapsedTime timer = new ElapsedTime();\r
\r
    public PIDController(double Kp, double Ki, double Kd) {\r
        this.Kp = Kp;\r
        this.Ki = Ki;\r
        this.Kd = Kd;\r
    }\r
\r
    public double calculate(double currentPosition) {\r
        double error = target - currentPosition;\r
        double derivative = (error - lastError) / timer.seconds();\r
        integralSum += error * timer.seconds();\r
\r
        // Anti-windup for the integral term\r
        if (Math.abs(error) < 1) { // Threshold\r
             integralSum = 0;\r
        }\r
\r
        double output = (Kp * error) + (Ki * integralSum) + (Kd * derivative);\r
\r
        lastError = error;\r
        timer.reset();\r
\r
        return output;\r
    }\r
\r
    public void setTarget(double target) {\r
        this.target = target;\r
    }\r
}\r
\`\`\`\r
\r
## Tuning Your PID\r
\r
Tuning is the process of finding the right values for _K_p_, _K_i_, and _K_d_.\r
\r
1. **Set $K_i$ and $K_d$ to zero.**\r
2. **Increase $K_p$** until the system starts to oscillate steadily.\r
3. **Increase $K_d$** to dampen the oscillations and reach the target quickly without overshooting.\r
4. **Increase $K_i$** only if you have a steady-state error (the robot stops just before the target).\r
`;export{r as default};
