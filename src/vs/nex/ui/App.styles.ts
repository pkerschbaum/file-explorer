import { css, Theme } from '@emotion/react';

export const styles = {
	container: (theme: Theme) =>
		css`
			padding-top: ${theme.spacing()};

			display: grid;
			grid-template-columns: 200px 1fr;
			grid-template-rows: 1fr max-content;
			grid-template-areas:
				'explorer-tabs active-explorer-panel'
				'processes processes';
			grid-column-gap: ${theme.spacing()};

			/*
			 * disable outline if things are focused. repeat ampersand to increase specificity (VS code style
			 * which needs to get overriden comes e.g. from selector ".monaco-workbench input[type="text"]:focus")
			 */
			&&& input:focus,
			&&& button:focus,
			&&& [tabindex='0']:focus,
			&&& [tabindex='-1']:focus {
				outline: 0;
			}
		`,

	tabsArea: (theme: Theme) => css`
		grid-area: explorer-tabs;
		padding-left: ${theme.spacing()};
		padding-bottom: ${theme.spacing()};
	`,

	activeExplorerArea: (theme: Theme) => css`
		grid-area: active-explorer-panel;
		padding-right: ${theme.spacing()};
		padding-bottom: ${theme.spacing()};
	`,

	processesArea: (theme: Theme) => css`
		padding-bottom: ${theme.spacing()};
		grid-area: processes;
		overflow-x: auto;

		& > *:first-of-type {
			margin-left: ${theme.spacing()};
		}
		& > *:last-of-type {
			margin-right: ${theme.spacing()};
		}
	`,

	tabsPanel: (theme: Theme) => css`
		border-right: 1px solid ${theme.palette.divider};
	`,

	tab: css`
		text-transform: none;
	`,
};
