// css-variables.d.ts

// declare module 'variables.css' {
//   const content: {
//     '--red': string;
//     '--blue': string;
//     '--primary-color': string;
//     '--font-size-large': string;
//     // Add more variables as needed
//     [key: `--${string}`]: string;
//   };
//   export default content;
// }

declare namespace CSS {
  interface Properties {
    // Add more CSS properties as needed
    '--red': string;
    '--blue': string;
    '--primary-color': string;
    '--font-size-large': string;
    [key: string]: string | number | undefined;
  }
}

declare module '*.css' {
  const styles: CSS.Properties;
  export default styles;
}
