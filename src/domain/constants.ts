export const FILE_ICON_THEMES = {
  vsCode: {
    label: 'VS Code',
    fsPathFragment: 'vscode-icons-team.vscode-icons-11.6.0',
  },
  materialDesign: {
    label: 'Material Design',
    fsPathFragment: 'PKief.material-icon-theme-4.10.0',
  },
} as const;
export type AvailableFileIconTheme = keyof typeof FILE_ICON_THEMES;
export type FileIconTheme = typeof FILE_ICON_THEMES[AvailableFileIconTheme];
