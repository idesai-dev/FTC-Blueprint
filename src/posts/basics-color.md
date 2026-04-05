---
title: Color Sensor
date: 2026-04-05
description: How to read RGB and HSV values from the REV Color Sensor.
tags: [software, completed, beginner]
author: Ishaan Desai
published: true
---

# Color Sensor Bascis

The color sensor (most common being the REV Color/Range Sensor) allows your robot to detect colors, light levels, and even proximity. This is essential for detecting team props, game pieces, or tape on the field.

<br>

> [!TIP]
> **Why use a Color Sensor?** Beyond just "seeing" color, these sensors are great for identifying the orientation of objects or ensuring a robot has correctly grabbed a specific game piece.

<br>

---

<br>

## 1. Initialization

Add the color sensor to your hardware map.

```java
ColorSensor colorSensor = hardwareMap.get(ColorSensor.class, "colorSensor");
```

<br>

## 2. Reading Raw RGB Values

The simplest way to use the sensor is to read the individual Red, Green, and Blue channels.

```java
int red = colorSensor.red();
int green = colorSensor.green();
int blue = colorSensor.blue();

telemetry.addData("Red", red);
telemetry.addData("Green", green);
telemetry.addData("Blue", blue);
```

<br>

## 3. Detecting Specific Colors

Comparing raw RGB values can be tricky because lighting conditions change. A common technique is to check which value is the highest.

```java
if (red > blue && red > green) {
    telemetry.addData("Color", "Red Detected");
} else if (blue > red && blue > green) {
    telemetry.addData("Color", "Blue Detected");
}
```

<br>

For more reliable color detection, it's recommended to convert your RGB values into **HSV** (Hue, Saturation, Value).
- **Hue:** Represents the "color" itself (0-360 degrees). It is much less sensitive to brightness than raw RGB.
- **Saturation:** How "intense" the color is.
- **Value:** The brightness of the color.

```java
float hsvValues[] = {0F, 0F, 0F};
// Convert RGB to HSV. The * 8 is a common scaling factor for REV sensors.
Color.RGBToHSV(colorSensor.red() * 8, colorSensor.green() * 8, colorSensor.blue() * 8, hsvValues);

telemetry.addData("Hue", hsvValues[0]);
```
*Tip: Red is usually around 0 or 360, Blue is around 240, and Yellow is around 60.*

<br>

## 5. Built-in Distance Sensing

Many color sensors (like the REV V3) also function as distance sensors. This is great for "Check if a piece is in the intake" logic.

```java
import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;

double distance = ((DistanceSensor) colorSensor).getDistance(DistanceUnit.CM);
telemetry.addData("Distance (cm)", "%.2f", distance);
```

<br>

---

<br>

This example shows how to use the Color Sensor to detect if a "Red" vs "Blue" object is in front of the robot using HSV for better reliability.

```java
package org.firstinspires.ftc.teamcode;

import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.ColorSensor;
import com.qualcomm.robotcore.hardware.DistanceSensor;
import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;
import android.graphics.Color;

@TeleOp(name = "Color Sensor Example", group = "Sensor")
public class ColorSensorExample extends LinearOpMode {

    private ColorSensor colorSensor;

    @Override
    public void runOpMode() {
        // 1. Initialize hardware
        // Note: We name it 'colorSensor' in the hardware map
        colorSensor = hardwareMap.get(ColorSensor.class, "colorSensor");

        telemetry.addData("Status", "Initialized");
        telemetry.update();

        waitForStart();

        while (opModeIsActive()) {
            // 2. Read values and convert to HSV
            float hsvValues[] = {0F, 0F, 0F};
            Color.RGBToHSV(colorSensor.red() * 8, colorSensor.green() * 8, colorSensor.blue() * 8, hsvValues);
            
            // Also read distance!
            double dist = ((DistanceSensor) colorSensor).getDistance(DistanceUnit.CM);

            // 3. Logic for detection (using Hue)
            String detected = "NONE";
            
            // Only detect if something is close enough (e.g. < 5cm)
            if (dist < 5.0) {
                if (hsvValues[0] < 30 || hsvValues[0] > 330) {
                    detected = "RED";
                } else if (hsvValues[0] > 200 && hsvValues[0] < 260) {
                    detected = "BLUE";
                } else if (hsvValues[0] > 40 && hsvValues[0] < 80) {
                    detected = "YELLOW";
                }
            }

            // 4. Telemetry output
            telemetry.addData("Object Detected", detected);
            telemetry.addData("Distance (cm)", "%.1f", dist);
            telemetry.addData("Hue", "%.1f", hsvValues[0]);
            telemetry.update();
        }
    }
}
```

<br>

---

<br>

> [!IMPORTANT]
> **Lighting:** The REV Color Sensor has a built-in LED. You can turn it on or off using `colorSensor.enableLed(true)`. This is helpful for surface detection but might interfere with detecting distant objects.

