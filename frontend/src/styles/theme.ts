import { createTheme } from '@mui/material/styles';

// Discord-inspired color scheme
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#5865F2', // Discord blurple
      light: '#7289DA',
      dark: '#4752C4',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#99AAB5', // Discord grey
      contrastText: '#2C2F33',
    },
    error: {
      main: '#ED4245', // Discord red
    },
    background: {
      default: '#F2F3F5', // Discord light background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2F33', // Dark text
      secondary: '#4F5660',
    },
    action: {
      hover: '#DCDEE1', // Subtle hover background
    },
  },
  typography: {
    fontFamily: ['"Tahoma"', '"Verdana"', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h6: {
      fontWeight: 600,
      color: '#2C2F33',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F2F3F5',
          color: '#2C2F33',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#5865F2',
          color: '#FFFFFF',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '4px',
          padding: '8px 16px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#4752C4',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#8B9AA3',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#2C2F33',
          },
          '& .MuiInputLabel-root': {
            color: '#4F5660',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#DCDEE1',
            },
            '&:hover fieldset': {
              borderColor: '#5865F2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5865F2',
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#DCDEE1',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
});

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#5865F2', // Discord blurple
      light: '#7289DA',
      dark: '#4752C4',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4F5660', // Discord dark grey
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#ED4245', // Discord red
    },
    background: {
      default: '#2C2F33', // Discord dark background
      paper: '#36393F',
    },
    text: {
      primary: '#DCDDDE', // Light text
      secondary: '#B0B2B5',
    },
    action: {
      hover: '#40444B', // Subtle hover background
    },
  },
  typography: {
    fontFamily: ['"Tahoma"', '"Verdana"', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h6: {
      fontWeight: 600,
      color: '#DCDDDE',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#2C2F33',
          color: '#DCDDDE',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#36393F',
          color: '#DCDDDE',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '4px',
          padding: '8px 16px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#4752C4',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#5C6269',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4)',
          backgroundColor: '#36393F',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#DCDDDE',
          },
          '& .MuiInputLabel-root': {
            color: '#B0B2B5',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#4F5660',
            },
            '&:hover fieldset': {
              borderColor: '#5865F2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5865F2',
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#40444B',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
});