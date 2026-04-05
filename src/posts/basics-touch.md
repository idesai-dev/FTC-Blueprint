---
title: Touch Sensor
date: 2026-04-05
description: Simple digital inputs for limit switches and button presses.
tags: [software, completed, beginner]
author: Ishaan Desai
published: true
---

# Touch Sensor Guide

The touch sensor is a simple digital switch. It returns a boolean value: either **pressed** or **not pressed**.

<br>

> [!NOTE]
> Even though it's called a "Touch" sensor, it behaves exactly like a **limit switch** or a **button**. In code, it's a `DigitalChannel` that returns `true` or `false`.

<br>

---

<br>

## 1. Initialization

```java
TouchSensor touchSensor = hardwareMap.get(TouchSensor.class, "touchSensor");
```

<br>

## 2. Basic Usage

The most common method is `isPressed()`.

```java
if (touchSensor.isPressed()) {
    telemetry.addData("Touch", "IS PRESSED");
    // e.g., stop a motor
    liftMotor.setPower(0);
} else {
    telemetry.addData("Touch", "Not Pressed");
}
```

<br>

If you have a lift or an arm, you can place a touch sensor at the extreme end of its range. When the mechanism hits the sensor, you can:
1. **Stop the motor** immediately to prevent damage.
2. **Reset the encoder** to zero to ensure your software stays calibrated.

```java
if (limitSwitch.isPressed()) {
    // Stop and reset encoder once it hits the bottom
    slideMotor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
    slideMotor.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
}
```

<br>

## 4. Single-Press Logic (Debouncing)

If you want to toggle something (like a claw) when you press a touch sensor, you need to make sure it only triggers **once** per press.

```java
boolean lastState = false;
boolean clawOpen = false;

// Inside your loop:
boolean currentState = touchSensor.isPressed();
if (currentState && !lastState) {
    // This only runs the moment the sensor is FIRST pressed
    clawOpen = !clawOpen; 
}
lastState = currentState;
```

<br>

---

<br>

This example shows how to use the Touch Sensor as a limit switch for a simple motor-based lift, ensuring it doesn't crash into the bottom.

```java
package org.firstinspires.ftc.teamcode;

import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.TouchSensor;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Touch Sensor Limit Example", group = "Sensor")
public class TouchSensorExample extends LinearOpMode {

    private TouchSensor limitSwitch;
    private DcMotor liftMotor;

    @Override
    public void runOpMode() {
        // 1. Initialize hardware
        limitSwitch = hardwareMap.get(TouchSensor.class, "touchSensor");
        liftMotor = hardwareMap.get(DcMotor.class, "liftMotor");

        telemetry.addData("Status", "Initialized");
        telemetry.update();

        waitForStart();

        while (opModeIsActive()) {
            // 2. Control Motor with joystick
            double liftPower = -gamepad1.left_stick_y;

            // 3. Limit Switch Logic:
            // If the sensor is pressed AND we are trying to go DOWN (negative power)
            if (limitSwitch.isPressed() && liftPower < 0) {
                 liftMotor.setPower(0);
                 
                 // Optional: Reset encoder when we hit the limit
                 liftMotor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
                 liftMotor.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
                 
                 telemetry.addData("Limit", "LIFT AT BOTTOM");
            } else {
                 liftMotor.setPower(liftPower);
                 telemetry.addData("Limit", "Normal Operation");
            }

            // 4. Telemetry output
            telemetry.addData("Lift Power", "%.2f", liftPower);
            telemetry.addData("Switch Pressed", limitSwitch.isPressed());
            telemetry.update();
        }
    }
}
```

<br>

---

<br>

> [!TIP]
> **Magnetic Limit Switches:** REV also makes Magnetic Limit Switches that work similarly to touch sensors but don't require physical contact. They use the same `TouchSensor` class or `DigitalChannel` in code.

