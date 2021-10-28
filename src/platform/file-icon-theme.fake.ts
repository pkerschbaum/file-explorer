import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import axios from 'axios';

import { PlatformFileIconTheme } from '@app/platform/file-icon-theme';

export declare namespace IconClassesHttp {
  export type Request = {
    uriStringified?: string;
    fileKind: FileKind;
  };
  export type Response = {
    iconClassesString: string[];
  };
}
export declare namespace CssRulesHttp {
  export type Response = {
    cssRules: string;
  };
}

export const PORT = 3001;
export const ICON_CLASSES_SLUG = 'icon-classes';
export const CSS_RULES_SLUG = 'css-rules';
const localhostClient = axios.create({
  baseURL: `http://localhost:${PORT}`,
});

export const httpFileIconTheme: PlatformFileIconTheme = {
  loadIconClasses: async (resource, fileKind) => {
    const data: IconClassesHttp.Request = {
      uriStringified: resource === undefined ? undefined : resource.toString(),
      fileKind,
    };
    const response = await localhostClient.request<IconClassesHttp.Response>({
      method: 'POST',
      url: ICON_CLASSES_SLUG,
      data,
    });
    return response.data.iconClassesString;
  },
  loadCssRules: async (fileIconThemePathFragment) => {
    const response = await localhostClient.request<CssRulesHttp.Response>({
      method: 'GET',
      url: CSS_RULES_SLUG,
      params: {
        fileIconThemePathFragment,
      },
    });
    return response.data.cssRules;
  },
};
