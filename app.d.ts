/// <reference types="expo" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "uuid" {
  export function v4(): string;
}