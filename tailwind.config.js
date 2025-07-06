/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				'body': ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
				'display': ['Atkinson Hyperlegible', 'Georgia', 'serif'],
			},
			colors: {
				'earth-bg': '#F5F1E8',
				'bark-text': '#403A30',
				'branch-accent': '#B05B3B',
				'leaf-alt': '#587474',
				'root-secondary': '#A09787',

				'moss-subtle': 'rgba(64,58,48,0.05)',
			},
			spacing: {
				'seed': '2px',
				'sprout': '4px',
				'leaf': '8px',
				'twig': '16px',
				'branch': '24px',
				'trunk': '48px',
				'forest': '96px',
			},
			borderRadius: {
				'seed': '2px',
				'leaf': '6px',
				'branch': '12px',
				'organic': '12px 8px 14px 6px',
				'trunk': '20px',
			},
			fontSize: {
				'trunk': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
				'branch': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
				'twig': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
				'leaf': ['17px', { lineHeight: '1.8', fontWeight: '400' }],
				'root': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
			},
			screens: {
				'seed': '320px',
				'sprout': '480px',
				'branch': '768px',
				'trunk': '1024px',
				'forest': '1280px',
			},
			animation: {
				'grow': 'grow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'sway': 'sway 3s ease-in-out infinite',
			},
			keyframes: {
				grow: {
					'0%': { transform: 'scale(0.95)', opacity: '0.8' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				sway: {
					'0%, 100%': { transform: 'rotate(-1deg)' },
					'50%': { transform: 'rotate(1deg)' },
				},
				'pulse-border': {
					'0%': { 'box-shadow': '0 0 0 0rem rgba(176, 91, 59, 0.5)' },
					'70%': { 'box-shadow': '0 0 0 0.5rem rgba(176, 91, 59, 0)' },
					'100%': { 'box-shadow': '0 0 0 0rem rgba(176, 91, 59, 0)' },
				}
			},
			lineHeight: {
				'relaxed': '1.8',
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'--tw-prose-body': theme('colors.bark-text'),
						'--tw-prose-headings': theme('colors.bark-text'),
						'--tw-prose-links': theme('colors.branch-accent'),
						'--tw-prose-bullets': theme('colors.branch-accent'),
						'--tw-prose-quotes': theme('colors.root-secondary'),
						'--tw-prose-quote-borders': `theme('colors.branch-accent / 40%')`,
						'--tw-prose-code': '#403A30',
						'--tw-prose-pre-bg': theme('colors.moss-subtle'),
						'--tw-prose-hr': `theme('colors.root-secondary / 0.2')`,
						color: theme('colors.bark-text'),
						lineHeight: '1.8',
						fontSize: '17px',
						h1: {
							...theme('fontSize.trunk'),
							fontFamily: theme('fontFamily.display').join(', '),
							marginTop: theme('spacing.branch'),
							marginBottom: theme('spacing.twig'),
						},
						h2: {
							...theme('fontSize.branch'),
							fontFamily: theme('fontFamily.display').join(', '),
							color: theme('colors.branch-accent'),
							marginTop: theme('spacing.twig'),
							marginBottom: theme('spacing.leaf'),
						},
						h3: {
							...theme('fontSize.twig'),
							marginTop: theme('spacing.leaf'),
							marginBottom: theme('spacing.leaf'),
						},
						p: {
							marginTop: 0,
							marginBottom: theme('spacing.leaf'),
						},
						a: {
							fontWeight: 'normal',
							textDecoration: 'none',
							borderBottom: `2px dotted currentColor`,
							transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
						},
						'a:hover': {
							color: theme('colors.leaf-alt'),
							borderBottomStyle: 'solid',
							borderBottomWidth: '3px',
						},
						blockquote: {
							paddingTop: theme('spacing.leaf'),
							paddingBottom: theme('spacing.leaf'),
							paddingLeft: theme('spacing.twig'),
							marginLeft: theme('spacing.twig'),
							marginRight: 0,
							fontStyle: 'italic',
							backgroundColor: `theme('colors.moss-subtle / 50%')`,
							borderRadius: `0 ${theme('borderRadius.leaf')} ${theme('borderRadius.leaf')} 0`,
						},
						code: {
							backgroundColor: theme('colors.moss-subtle'),
							padding: `${theme('spacing.sprout')} ${theme('spacing.leaf')}`,
							borderRadius: theme('borderRadius.leaf'),
							fontFamily: theme('fontFamily.mono').join(','),
							border: `1px solid theme('colors.root-secondary / 20%')`,
							fontWeight: '500',
						},
						'code::before': { content: 'none' },
						'code::after': { content: 'none' },
						ul: {
							paddingLeft: 0,
							listStyleType: 'none',
						},
					},
				},
			}),
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
} 