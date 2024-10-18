import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
}

export default function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    browserName: '',
    browserVersion: '',
    osName: '',
    osVersion: '',
  });

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Variables para almacenar la información
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;
    let browserName = '';
    let browserVersion = '';
    let osName = '';
    let osVersion = '';

    // Detectar el tipo de dispositivo
    if (/android/i.test(userAgent)) {
      osName = 'Android';
      isMobile = true;
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any)?.MSStream) {
      osName = 'iOS';
      isMobile = true;
    } else if (/Windows NT/.test(userAgent)) {
      osName = 'Windows';
      isDesktop = true;
    } else if (/Mac OS X/.test(userAgent)) {
      osName = 'Mac OS';
      isDesktop = true;
    } else if (/CrOS/.test(userAgent)) {
      osName = 'Chrome OS';
      isDesktop = true;
    } else if (/Linux/.test(userAgent)) {
      osName = 'Linux';
      isDesktop = true;
    } else {
      osName = 'Desconocido';
    }

    // Detectar el navegador y su versión
    const browserData = [
      { name: 'Edge', regex: /Edg\/([0-9\._]+)/ },
      { name: 'Chrome', regex: /Chrome\/([0-9\.]+)/ },
      { name: 'Firefox', regex: /Firefox\/([0-9\.]+)/ },
      { name: 'Safari', regex: /Version\/([0-9\._]+).*Safari/ },
      { name: 'Opera', regex: /OPR\/([0-9\.]+)/ },
      { name: 'Internet Explorer', regex: /MSIE\s([0-9\.]+)/ },
      { name: 'Internet Explorer', regex: /Trident\/.*rv:([0-9\.]+)/ },
    ];

    for (const browser of browserData) {
      const match = userAgent.match(browser.regex);
      if (match) {
        browserName = browser.name;
        browserVersion = match[1];
        break;
      }
    }

    if (!browserName) {
      browserName = 'Desconocido';
      browserVersion = 'Desconocida';
    }

    // Detectar la versión del sistema operativo
    const osVersionRegexes: { [key: string]: RegExp } = {
      Windows: /Windows NT ([0-9\._]+)/,
      'Mac OS': /Mac OS X ([0-9\._]+)/,
      Android: /Android ([0-9\.]+)/,
      iOS: /OS ([0-9\._]+) like Mac OS X/,
      Linux: /Linux/,
      'Chrome OS': /CrOS [a-zA-Z0-9 ]+ ([0-9\.]+)/,
    };

    if (osName in osVersionRegexes) {
      const osRegex = osVersionRegexes[osName];
      const match = userAgent.match(osRegex);
      if (match) {
        osVersion = match[1].replace(/_/g, '.');
      } else {
        osVersion = 'Desconocida';
      }
    }

    // Detectar si es tablet
    if (/Tablet|iPad/i.test(userAgent)) {
      isTablet = true;
      isMobile = false;
    }

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      browserName,
      browserVersion,
      osName,
      osVersion,
    });
  }, []);

  return deviceInfo;
}
