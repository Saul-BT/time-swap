import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import theme from "@/theme";

/**
 * The cache provider flushes Emotion's server-rendered styles into the streamed
 * HTML. `enableCssLayer` wraps them in `@layer mui` so plain CSS can override them.
 */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
