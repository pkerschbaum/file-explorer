import { config } from '@app/config';

export const THUMBNAIL_PROTOCOL_SCHEME = `${config.productName}-thumbnail` as const;
export const NATIVE_FILE_ICON_PROTOCOL_SCHEME = `${config.productName}-native-file-icon` as const;
