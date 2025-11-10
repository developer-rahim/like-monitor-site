// types/requestProperties.ts
export interface RequestProperties {
  parseUrl: URL;
  pathName: string;
  trimedPath: string;
  reqMethod: string;
  quaryStringObject: Record<string, string>;
  headersObject: Record<string, string>;
}
