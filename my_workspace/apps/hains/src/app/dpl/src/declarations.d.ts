// Declaration file for the jsx-imports in the main.tsx file
declare module '*.jsx' {
  const value: any;
  export default value;
}

declare module '*.js' {
  const value: any;
  export default value;
}

declare module 'hellojs/dist/hello.all';
declare module 'hellojs';

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}
