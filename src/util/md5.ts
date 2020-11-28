import {Md5} from 'ts-md5';

export const md5 = (val: string) => Md5.hashStr(val).toString();
