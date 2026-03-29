const n=`---\r
title: Pedro Pathing: Making an Auto\r
date: 2026-03-28\r
description: Building a complete autonomous routine with Pedro Pathing.\r
tags: [software, intermediate, autonomous]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
# Making an Autonomous Routine with Pedro Pathing\r
\r
Designing an autonomous routine involves defining a sequence of paths and subsystem actions to achieve a specific goal.\r
\r
## Designing Your Path\r
- **Bezier Curves:** Use Bezier curves to define the robot's trajectory.\r
- **Pose Generation:** Use your robot's pose and heading to generate paths.\r
- **Path Segmenting:** Break down your routine into several smaller, manageable segments.\r
\r
## Programming Your Auto\r
- **State Machines:** Use state machines to manage different parts of your autonomous routine.\r
- **Asynchronicity:** Ensure your autonomous routine is non-blocking and can handle simultaneous actions.\r
- **Path Following:** Use Pedro's \`Follower\` class to follow your paths.\r
\r
### Basic Autonomous Example\r
\r
\`\`\`java\r
@Autonomous(name = "Basic Auto")\r
public class BasicAuto extends LinearOpMode {\r
    public Follower follower;\r
\r
    @Override\r
    public void runOpMode() {\r
        // Initialize the follower\r
        follower = new Follower(hardwareMap);\r
        \r
        // Define your path\r
        Path path = new Path(new BezierLine(new Point(0, 0, Point.CARTESIAN), new Point(100, 100, Point.CARTESIAN)));\r
        \r
        waitForStart();\r
        \r
        // Follow the path\r
        follower.followPath(path);\r
        \r
        // Update the follower\r
        while (opModeIsActive() && follower.isFollowing()) {\r
            follower.update();\r
        }\r
    }\r
}\r
\`\`\`\r
\r
## Tips for Autonomous routines\r
- **Logging:** Use logging to track your robot's performance during autonomous routines.\r
- **Testing:** Test your autonomous routine several times to ensure consistency.\r
- **Subsystem Integration:** Integrate your subsystems for a more efficient and reliable autonomous routine.\r
`;export{n as default};
