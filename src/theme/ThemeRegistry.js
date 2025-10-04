// "use client";
// import * as React from "react";
// import { CacheProvider } from "@emotion/react";
// import createCache from "@emotion/cache";

// export default function ThemeRegistry({ children }) {
//   const [cache] = React.useState(() =>
//     createCache({ key: "mui", prepend: true })
//   );
//   return <CacheProvider value={cache}>{children}</CacheProvider>;
// }