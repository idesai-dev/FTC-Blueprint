const fs = require('fs');
const path = require('path');

const posts = [
	{ slug: 'vision-opencv', title: 'OpenCV', description: 'OpenCV basics for FTC' },
	{ slug: 'vision-limelight', title: 'Limelight', description: 'Using Limelight in FTC' },
	{
		slug: 'vision-april-tag',
		title: 'April Tag Detection',
		description: 'April Tag Detection in FTC'
	},
	{
		slug: 'vision-object-detection',
		title: 'Object Detection',
		description: 'Object Detection basics'
	},
	{
		slug: 'vision-relocalization-metatag2',
		title: 'Relocalization with MetaTag2',
		description: 'MetaTag2 Relocalization'
	},
	{
		slug: 'ftc-dashboard',
		title: 'FTC Dashboard',
		description: 'Setting up and using FTC Dashboard'
	},
	{
		slug: 'mecanum-drivetrain',
		title: 'Mecanum Drivetrain & Code',
		description: 'Mecanum drivetrain programming'
	},
	{
		slug: 'basics-android-studio',
		title: 'Android Studio Setup',
		description: 'Setting up Android Studio for FTC'
	},
	{ slug: 'basics-mac', title: 'Mac Setup', description: 'Mac specific setup for Android Studio' },
	{
		slug: 'basics-windows',
		title: 'Windows Setup',
		description: 'Windows specific setup for Android Studio'
	},
	{
		slug: 'basics-wiring',
		title: 'Wiring and Configuration',
		description: 'Robot wiring and config'
	},
	{
		slug: 'basics-motors-servos',
		title: 'Motors and Servos',
		description: 'Programming motors and servos'
	},
	{ slug: 'basics-sensors', title: 'Sensors', description: 'Working with sensors' },
	{ slug: 'basics-distance', title: 'Distance Sensor', description: 'Using distance sensors' },
	{ slug: 'basics-color', title: 'Color Sensor', description: 'Using color sensors' },
	{ slug: 'basics-touch', title: 'Touch Sensor', description: 'Using touch sensors' },
	{ slug: 'basics-imu', title: 'IMU (Rev)', description: 'Using the REV IMU' },
	{
		slug: 'types-of-opmodes',
		title: 'Linear OpMode vs. OpMode',
		description: 'Differences between OpMode structures'
	},
	{ slug: 'sloth-load', title: 'Sloth Load', description: 'Sloth load concept' },
	{
		slug: 'common-practices',
		title: 'Common Practices',
		description: 'Common programming practices in FTC'
	},
	{ slug: 'bulkreads', title: 'Bulkreads', description: 'Understanding bulkreads for optimization' }
];

posts.forEach((p) => {
	const content = `---
title: ${p.title}
date: 2026-03-28
description: ${p.description}
tags: [software, manual, easy]
author: Blueprint
published: true
---

# ${p.title}
Content coming soon...
`;
	fs.writeFileSync(path.join(__dirname, 'src/posts', p.slug + '.md'), content);
});
console.log('Posts generated successfully!');
