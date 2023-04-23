// Data file for width 8 numeric fonts
// Made with https://pjrp.github.io/MDParolaFontEditor
// First digit is the character's width, the the hex values for the matrixes in decimal
// Data file for numeric scoreboard fonts
#pragma once

MD_MAX72XX::fontType_t Width8NumsLower[] PROGMEM = 
{
	'F', 1, 48, 57, 8,
	8, 255, 255, 192, 192, 192, 255, 255, 0, 	// 48 - '0' lower
	8, 0, 0, 0, 255, 255, 0, 0, 0, 	// 49 - '1' lower
	8, 255, 255, 193, 193, 193, 193, 193, 0, 	// 50 - '2' lower
	8, 193, 193, 193, 193, 193, 255, 255, 0, 	// 51 - '3' lower
	8, 1, 1, 1, 1, 1, 255, 255, 0, 	// 52 - '4' lower
	8, 193, 193, 193, 193, 193, 255, 255, 0, 	// 53 - '5' lower
	8, 255, 255, 193, 193, 193, 255, 255, 0, 	// 54 - '6' lower
	8, 0, 0, 0, 0, 0, 255, 255, 0, 	// 55 - '7' lower
	8, 255, 255, 193, 193, 193, 255, 255, 0, 	// 56 - '8' lower
	8, 1, 1, 1, 1, 1, 255, 255, 0, 	// 57 - '9' lower
};

MD_MAX72XX::fontType_t Width8NumsUpper[] PROGMEM = 
{
  	'F', 1, 48, 57, 8,
  	8, 255, 255, 3, 3, 3, 255, 255, 0, 	// 176 - '0' upper
	8, 0, 0, 0, 255, 255, 0, 0, 0, 	// 177 - '1' upper
	8, 131, 131, 131, 131, 131, 255, 255, 0, 	// 178 - '2' upper
	8, 131, 131, 131, 131, 131, 255, 255, 0, 	// 179 - '3' upper
	8, 255, 255, 128, 128, 128, 255, 255, 0, 	// 180 - '4' upper
	8, 255, 255, 131, 131, 131, 131, 131, 0, 	// 181 - '5' upper
	8, 255, 255, 131, 131, 131, 131, 131, 0, 	// 182 - '6' upper
	8, 3, 3, 3, 3, 3, 255, 255, 0, 	// 183 - '7' upper
	8, 255, 255, 131, 131, 131, 255, 255, 0, 	// 184 - '8' upper
	8, 255, 255, 131, 131, 131, 255, 255, 0, 	// 185 - '9' upper
};