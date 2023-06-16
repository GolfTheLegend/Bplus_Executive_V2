import DeviceInfo from 'react-native-device-info';
import {getAsyncStorage, saveAsyncStorage} from './asyncStorage';
import uuid from 'react-native-uuid';
import { Language } from '../../../translations/I18n';


export const getDeviceUniqeId = () =>
  new Promise<string | null>(async resolve => {
    try {
      let deviceId = await getAsyncStorage('@mac');

        console.log('getDeviceUniqeId getSavedDeviceUniqueId', deviceId);

      if (!deviceId || deviceId == '' || deviceId == '02:00:00:00:00:00') {
        deviceId = await DeviceInfo.getMacAddress();
        console.log('getDeviceUniqeId getMacAddress', deviceId);
      }
      if (!deviceId || deviceId == '' || deviceId == '02:00:00:00:00:00') {
        deviceId = await DeviceInfo.getUniqueId();
        console.log('getDeviceUniqeId getUniqueId', deviceId);
      }
      if (!deviceId || deviceId == '' || deviceId == '02:00:00:00:00:00') {
        deviceId = uuid.v4().toString();
        // console.log('getDeviceUniqeId getUniqueId', deviceId);
      }

      await saveAsyncStorage('@mac', deviceId);

      resolve(deviceId);
    } catch (error) {
      console.log(error);
      resolve(null);
    }
  });
export const Changefont = () => {
  return Language.getLang() === 'lao'?"CSChatThaiUI":undefined
  
}