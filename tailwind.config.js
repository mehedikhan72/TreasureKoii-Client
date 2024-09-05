/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
		textStroke: ({ theme }) => ({
			sm: "1px",
			md: "2px",
			lg: "3px",
			...theme("spacing"),
		}),
	},
	plugins: [
		plugin(function ({ matchComponents, theme }) {
			matchComponents(
				{
					"text-stroke": (value) => ({
						textShadow: `1px 1px ${value} ${theme("colors.black")}, 
                      -1px 1px ${value} ${theme("colors.black")}, 
                      -1px -1px ${value} ${theme("colors.black")}, 
                      1px -1px ${value} ${theme("colors.black")}`,
					}),
				},
				{
					values: theme("textStroke"),
				}
			);
		}),
	],
};
