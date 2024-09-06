/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				prim: "#fcc793",
				"prim-input": "#fae2ca",
				"input-placeholder": "#887463",
				// "prim-text": "#fff2e3",
				"prim-text": "#fae2ca",
			},
		},
		textStroke: ({ theme }) => ({
			sm: "2px",
			md: "4px",
			lg: "6px",
			...theme("spacing"),
		}),
	},
	plugins: [
		plugin(function ({ addComponents, matchComponents, theme }) {
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
			matchComponents(
				{
					"stroked-text": (value) => ({
						textShadow: `1px 1px ${value} ${theme("colors.black")}, 
						  	-1px 1px ${value} ${theme("colors.black")}, 
						  	-1px -1px ${value} ${theme("colors.black")}, 
						  	 1px -1px ${value} ${theme("colors.black")}`,
						color: theme("colors.prim-text"),
					}),
				},
				{
					values: theme("textStroke"),
				}
			);
		}),
	],
};
