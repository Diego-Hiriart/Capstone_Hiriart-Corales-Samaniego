// Data file for width 8 numeric fonts
// Made with https://pjrp.github.io/MDParolaFontEditor
// First digit is the character's width, the the hex values for the matrixes in decimal
// Data file for numeric scoreboard fonts
#pragma once

MD_MAX72XX::fontType_t Width8NumsLower[] PROGMEM = 
{
	'F', 1, 48, 57, 8,
	8, 0, 127, 127, 96, 96, 127, 127, 0, 	// 48  0 lower
	8, 0, 0, 0, 127, 127, 0, 0, 0, 	// 49   1 lower
	8, 0, 127, 127, 97, 97, 97, 97, 0, 	// 50   2 lower
	8, 0, 97, 97, 97, 97, 127, 127, 0, 	// 51   3 lower
	8, 0, 1, 1, 1, 1, 127, 127, 0, 	// 52   4 lower
	8, 0, 97, 97, 97, 97, 127, 127, 0, 	// 53 5 lower
	8, 0, 127, 127, 97, 97, 127, 127, 0, 	// 54 6 lower
	8, 0, 0, 0, 0, 0, 127, 127, 0, 	// 55 7 lower
	8, 0, 127, 127, 97, 97, 127, 127, 0, 	// 56 8 lower
	8, 0, 1, 1, 1, 1, 127, 127, 0, 	// 57 9 lower
};

MD_MAX72XX::fontType_t Width8NumsUpper[] PROGMEM = 
{
  	'F', 1, 48, 57, 8,
  	8, 0, 254, 254, 6, 6, 254, 254, 0, 	// 48  0 lower
	8, 0, 0, 0, 254, 254, 0, 0, 0, 	// 49   1 upper
	8, 0, 134, 134, 134, 134, 254, 254, 0, 	// 50   2 upper
	8, 0, 134, 134, 134, 134, 254, 254, 0, 	// 51   3 upper
	8, 0, 254, 254, 128, 128, 254, 254, 0, 	// 52   4 upper
	8, 0, 254, 254, 134, 134, 134, 134, 0, 	// 53 5 upper
	8, 0, 254, 254, 134, 134, 134, 134, 0, 	// 54 6 upper
	8, 0, 6, 6, 6, 6, 254, 254, 0, 	// 55 7 upper
	8, 0, 254, 254, 134, 134, 254, 254, 0, 	// 56 8 upper
	8, 0, 254, 254, 134, 134, 254, 254, 0, 	// 57 9 upper
};