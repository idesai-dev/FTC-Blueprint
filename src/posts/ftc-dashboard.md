---
title: FTC Dashboard & Live Tuning
date: 2026-04-05
description: Using @Config to change variables while the robot is running.
tags: [software, completed, intermediate]
author: Ishaan Desai
published: true
---

FTC Dashboard is an essential web-based tool for debugging and tuning your robot. One of its most powerful features is the ability to change variables in your code **live** without recompiling or re-uploading your program.

<br>

---

<br>

## 1. How @Config Works

To make a variable "tunable," you must:
1. Annotate your class with `@Config`.
2. Declare variables as `public static`. 

### Why Static?
Static variables belong to the **class itself**, not a specific instance. When the Dashboard changes a value, it modifies that memory location in the JVM (Java Virtual Machine). Because your code reads from that same location, the change is instant.

```java
import com.acmerobotics.dashboard.config.Config;

@Config
public class MyRobotSettings {
    public static double SPEED_LIMIT = 0.7;
    public static double CLAW_TICKS = 100;
}
```

<br>

## 2. Organizing Constants

While you can put `@Config` on any class, it's best practice to create a dedicated class (often called `RobotConstants` or `Params`) to hold all your tunable values. This keeps your OpModes clean and ensures all your "magic numbers" are in one place.

```java
@Config
public class Params {
    public static class Lift {
        public static double P = 0.01;
        public static double I = 0.0;
        public static double D = 0.0001;
    }
    
    public static class Drivetrain {
        public static double MAX_VEL = 50.0;
    }
}
```

<br>

## 3. Beyond Simple Variables

FTC Dashboard isn't just for numbers! You can also use it for:
- **Telemetry Graphs:** Visualize sensor data or PID error in real-time.
- **Field View:** Overlay your robot's position on a virtual field map.
- **Camera Stream:** View what your webcam sees directly in the browser.

<br>

1. Connect your computer to the Control Hub's Wi-Fi.
2. Open your browser and navigate to `http://192.168.43.1:8080/dash`.
3. In the **Configuration** tab, you'll see your classes organized by name.
4. Adjust sliders or type values. Changes are sent the moment you press "Enter" or release the slider.

<br>

---

<br>

## Full Example: Tuning a PID Controller

This example shows how to use Dashboard constants to tune a lift's PID coefficients live.

```java
package org.firstinspires.ftc.teamcode;

import com.acmerobotics.dashboard.FtcDashboard;
import com.acmerobotics.dashboard.config.Config;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@Config
class LiftConstants {
    public static double P = 0.05;
    public static int TARGET_HEIGHT = 500;
}

@TeleOp(name = "PID Tuning Example")
public class TuningOpMode extends LinearOpMode {
    private DcMotor lift;

    @Override
    public void runOpMode() {
        lift = hardwareMap.get(DcMotor.class, "liftMotor");
        
        waitForStart();

        while (opModeIsActive()) {
            // Live-tuning P and target!
            int currentPos = lift.getCurrentPosition();
            double error = LiftConstants.TARGET_HEIGHT - currentPos;
            double power = error * LiftConstants.P;

            lift.setPower(power);

            // Send telemetry to Dashboard for graphing
            FtcDashboard dash = FtcDashboard.getInstance();
            com.firstinspires.ftc.robotcore.external.Telemetry dashTelemetry = dash.getTelemetry();
            
            dashTelemetry.addData("Error", error);
            dashTelemetry.addData("Current Pos", currentPos);
            dashTelemetry.addData("Target", LiftConstants.TARGET_HEIGHT);
            dashTelemetry.update();
        }
    }
}
```

<br>

---

<br>

> [!WARNING]
> **Static Persistence:** Changes made in the Dashboard are **not saved** to your source code. Once you find the perfect value, remember to go back into Android Studio and update the code with the new number!

