import { Observable } from 'tns-core-modules/data/observable';

import { View } from '@nativescript/core';
import { isAndroid, isIOS } from "@nativescript/core/platform";
import { BarkoderViewAndroid } from './barkoder-nativescript.android';
import { BarkoderViewIOS } from './barkoder-nativescript.ios';



let BarkoderView: typeof View;

if (isAndroid) {
    BarkoderView = require('./barkoder-nativescript.android').BarkoderViewAndroid;
} else if (isIOS) {
    BarkoderView = require('./barkoder-nativescript.ios').BarkoderViewIOS;
}

export { BarkoderView };

export namespace BarkoderConstants {


export enum DecoderType {
  Aztec = 0,
  AztecCompact = 1,
  QR = 2,
  QRMicro = 3,
  Code128 = 4,
  Code93 = 5,
  Code39 = 6,
  Codabar = 7,
  Code11 = 8,
  Msi = 9,
  UpcA = 10,
  UpcE = 11,
  UpcE1 = 12,
  Ean13 = 13,
  Ean8 = 14,
  PDF417 = 15,
  PDF417Micro = 16,
  Datamatrix = 17,
  Code25 = 18,
  Interleaved25 = 19,
  ITF14 = 20,
  IATA25 = 21,
  Matrix25 = 22,
  Datalogic25 = 23,
  COOP25 = 24,
  Code32 = 25,
  Telepen = 26,
  Dotcode = 27,
  IDDocument = 28,
  Databar14 = 29,
  DatabarLimited = 30,
  DatabarExpanded = 31
}

export enum FormattingType {
  Disabled = 0,
  Automatic = 1,
  GS1 = 2,
  AAMVA = 3
}

export enum DecodingSpeed {
  Fast = 0,
  Normal = 1,
  Slow = 2
}

export enum BarkoderResolution {
  HD = 'HD',
  FHD = 'Full HD',
  UHD = 'Ultra HD'

}

export enum MsiChecksumType {
  Disabled = 0,
  Mod10 = 1,
  Mod11 = 2,
  Mod1010 = 3,
  Mod1110 = 4,
  Mod11IBM = 5,
  Mod1110IBM = 6
}

export enum Code11ChecksumType {
  Disabled = 0,
  Single = 1,
  Double = 2
}

export enum Code39ChecksumType {
  Disabled = 0,
  Enabled = 1
}

export class Common extends Observable {

}

export interface BarkoderResultCallback {
  scanningFinished(results: any[], thumbnails: any[], resultImage: any): void;
}

export interface MaxZoomAvailableCallback {
   onMaxZoomAvailable(maxZoomFactor: any)
}

export interface FlashAvailableCallback {
  onFlashAvailable(isFlashAvailable: any)
}

export class BarkoderConfig {
  locationLineColor?: string;
  locationLineWidth?: number;
  roiLineColor?: string;
  roiLineWidth?: number;
  roiOverlayBackgroundColor?: string;
  closeSessionOnResultEnabled?: boolean;
  imageResultEnabled?: boolean;
  locationInImageResultEnabled?: boolean;
  locationInPreviewEnabled?: boolean;
  pinchToZoomEnabled?: boolean;
  regionOfInterestVisible?: boolean;
  barkoderResolution?: number; 
  beepOnSuccessEnabled?: boolean;
  vibrateOnSuccessEnabled?: boolean;
  decoder?: DekoderConfig;

  constructor(config: Partial<BarkoderConfig>) {
      Object.assign(this, config);
  }

  toJsonString(): string {
      const configAsJson: { [key: string]: any } = {
          "locationLineColor": this.locationLineColor,
          "locationLineWidth": this.locationLineWidth,
          "roiLineColor": this.roiLineColor,
          "roiLineWidth": this.roiLineWidth,
          "roiOverlayBackgroundColor": this.roiOverlayBackgroundColor,
          "closeSessionOnResultEnabled": this.closeSessionOnResultEnabled,
          "imageResultEnabled": this.imageResultEnabled,
          "locationInImageResultEnabled": this.locationInImageResultEnabled,
          "locationInPreviewEnabled": this.locationInPreviewEnabled,
          "pinchToZoomEnabled": this.pinchToZoomEnabled,
          "regionOfInterestVisible": this.regionOfInterestVisible,
          "barkoderResolution": this.barkoderResolution,
          "beepOnSuccessEnabled": this.beepOnSuccessEnabled,
          "vibrateOnSuccessEnabled": this.vibrateOnSuccessEnabled,
          "decoder": this.decoder.toMap()
      };

      return JSON.stringify(configAsJson);
  }
}



export class DekoderConfig {
  aztec?: BarcodeConfig;
  aztecCompact?: BarcodeConfig;
  qr?: BarcodeConfig;
  qrMicro?: BarcodeConfig;
  code128?: BarcodeConfigWithLength;
  code93?: BarcodeConfigWithLength;
  code39?: Code39BarcodeConfig;
  codabar?: BarcodeConfigWithLength;
  code11?: Code11BarcodeConfig;
  msi?: MSIBarcodeConfig;
  upcA?: BarcodeConfig;
  upcE?: BarcodeConfig;
  upcE1?: BarcodeConfig;
  ean13?: BarcodeConfig;
  ean8?: BarcodeConfig;
  pdf417?: BarcodeConfig;
  pdf417Micro?: BarcodeConfig;
  datamatrix?: DatamatrixBarcodeConfig;
  code25?: BarcodeConfig;
  interleaved25?: BarcodeConfig;
  itf14?: BarcodeConfig;
  iata25?: BarcodeConfig;
  matrix25?: BarcodeConfig;
  datalogic25?: BarcodeConfig;
  coop25?: BarcodeConfig;
  code32?: BarcodeConfig;
  telepen?: BarcodeConfig;
  dotcode?: BarcodeConfig;
  idDocument?: BarcodeConfig;
  databar14?: BarcodeConfig;
  databarExpanded?: BarcodeConfig;
  databarLimited?: BarcodeConfig;
  general?: GeneralSettings;

  constructor(config: Partial<DekoderConfig>) {
    Object.assign(this, config);
  }

  toMap() {
    const map = {
      'Aztec': this.aztec?.toMap(),
      'Aztec Compact': this.aztecCompact?.toMap(),
      'QR': this.qr?.toMap(),
      'QR Micro': this.qrMicro?.toMap(),
      'Code 128': this.code128?.toMap(),
      'Code 93': this.code93?.toMap(),
      'Code 39': this.code39?.toMap(),
      'Codabar': this.codabar?.toMap(),
      'Code 11': this.code11?.toMap(),
      'MSI': this.msi?.toMap(),
      'Upc-A': this.upcA?.toMap(),
      'Upc-E': this.upcE?.toMap(),
      'Upc-E1': this.upcE1?.toMap(),
      'Ean-13': this.ean13?.toMap(),
      'Ean-8': this.ean8?.toMap(),
      'PDF 417': this.pdf417?.toMap(),
      'PDF 417 Micro': this.pdf417Micro?.toMap(),
      'Datamatrix': this.datamatrix?.toMap(),
      'Code 25': this.code25?.toMap(),
      'Interleaved 2 of 5': this.interleaved25?.toMap(),
      'ITF 14': this.itf14?.toMap(),
      'IATA 25': this.iata25?.toMap(),
      'Matrix 25': this.matrix25?.toMap(),
      'Datalogic 25': this.datalogic25?.toMap(),
      'COOP 25': this.coop25?.toMap(),
      'Code 32': this.code32?.toMap(),   
      'Telepen': this.telepen?.toMap(), 
      'Dotcode': this.dotcode?.toMap(),
      'IDDocument': this.dotcode?.toMap(),
      'Databar 14': this.databar14?.toMap(),
      'Databar Expanded': this.databarExpanded?.toMap(),
      'Databar Limited': this.databarLimited?.toMap(),
      'general': this.general?.toMap()
    }

    return map;
  }
}

export class BarcodeConfig {
  enabled?: boolean;

  constructor(config: Partial<BarcodeConfig>) {
    Object.assign(this, config);
  }

  toMap() {
    const map = {
      "enabled": this.enabled
    }

    return map;
  }
}

export class BarcodeConfigWithLength {
  enabled?: boolean;
  private minLength?: number;
  private maxLength?: number;

  constructor(config: Partial<BarcodeConfigWithLength>) {
    Object.assign(this, config);
  }

  toMap() {
    const map = {
      "enabled": this.enabled,
      "minimumLength": this.minLength,
      "maximumLength": this.maxLength
    }

    return map;
  }

  setLengthRange(minLength: number, maxLength: number) {
    this.minLength = minLength;
    this.maxLength = maxLength;
  }
}

export class MSIBarcodeConfig {
  enabled?: boolean;
  private minLength?: number;
  private maxLength?: number;
  checksum?: MsiChecksumType;

  constructor(config: Partial<MSIBarcodeConfig>) {
    Object.assign(this, config);
  }

  toMap() {
    let map: { [key: string]: any } = {
      "enabled": this.enabled,
      "minimumLength": this.minLength,
      "maximumLength": this.maxLength,
      "checksum": this.checksum
    }

    return map;
  }

  setLengthRange(minLength: number, maxLength: number) {
    this.minLength = minLength;
    this.maxLength = maxLength;
  }
}

export class Code39BarcodeConfig {
  enabled?: boolean;
  private minLength?: number;
  private maxLength?: number;
  checksum?: Code39ChecksumType;

  constructor(config: Partial<Code39BarcodeConfig>) {
    Object.assign(this, config);
  }

  toMap() {
    let map: { [key: string]: any } = {
      "enabled": this.enabled,
      "minimumLength": this.minLength,
      "maximumLength": this.maxLength,
      "checksum": this.checksum
    }

    return map;
  }

  setLengthRange(minLength: number, maxLength: number) {
    this.minLength = minLength;
    this.maxLength = maxLength;
  }
}

export class Code11BarcodeConfig {
  enabled?: boolean;
  private minLength?: number;
  private maxLength?: number;
  checksum?: Code11ChecksumType;

  constructor(config: Partial<Code11BarcodeConfig>) {
    Object.assign(this, config);
  }

  toMap() {
    let map: { [key: string]: any } = {
      "enabled": this.enabled,
      "minimumLength": this.minLength,
      "maximumLength": this.maxLength,
      "checksum": this.checksum
    }

    return map;
  }

  setLengthRange(minLength: number, maxLength: number) {
    this.minLength = minLength;
    this.maxLength = maxLength;
  }
}

export class DatamatrixBarcodeConfig {
  enabled?: boolean;
  dpmMode?: number;
  private minLength?: number;
  private maxLength?: number;

  constructor(config: Partial<DatamatrixBarcodeConfig>) {
    Object.assign(this, config);
  }

  toMap() {
    let map: { [key: string]: any } = {
      "enabled": this.enabled,
      "dpmMode": this.dpmMode,
      "minimumLength": this.minLength,
      "maximumLength": this.maxLength,
    }

    return map;
  }

  setLengthRange(minLength: number, maxLength: number) {
    this.minLength = minLength;
    this.maxLength = maxLength;
  }
}


  export class QRBarcodeConfig {
    enabled?: boolean;
    dpmMode?: number;
    private minLength?: number;
    private maxLength?: number;

    constructor(config: Partial<QRBarcodeConfig>) {
      Object.assign(this, config);
    }

    toMap() {
      let map: { [key: string]: any } = {
        "enabled": this.enabled,
        "dpmMode": this.dpmMode,
        "minimumLength": this.minLength,
        "maximumLength": this.maxLength,
      }

      return map;
    }

    setLengthRange(minLength: number, maxLength: number) {
      this.minLength = minLength;
      this.maxLength = maxLength;
    }
  }

  export class QRMicroBarcodeConfig {
    enabled?: boolean;
    dpmMode?: number;
    private minLength?: number;
    private maxLength?: number;

    constructor(config: Partial<QRMicroBarcodeConfig>) {
      Object.assign(this, config);
    }

    toMap() {
      let map: { [key: string]: any } = {
        "enabled": this.enabled,
        "dpmMode": this.dpmMode,
        "minimumLength": this.minLength,
        "maximumLength": this.maxLength,
      }

      return map;
    }

    setLengthRange(minLength: number, maxLength: number) {
      this.minLength = minLength;
      this.maxLength = maxLength;
    }
  }

export class GeneralSettings {
  threadsLimit?: number;
  decodingSpeed?: DecodingSpeed;
  roiX?: number;
  roiY?: number;
  roiWidth?: number;
  roiHeight?: number;
  formattingType?: FormattingType;
  encodingCharacterSet?: string;
  upcEanDeblur?: number;
  enableMisshaped1D? : number;

  constructor(config: Partial<GeneralSettings>) {
    Object.assign(this, config);
  }

  toMap() {
    let map: { [key: string]: any } = {
      "maxThreads": this.threadsLimit,
      "decodingSpeed": this.decodingSpeed,
      "roi_x": this.roiX,
      "roi_y": this.roiY,
      "roi_w": this.roiWidth,
      "roi_h": this.roiHeight,
      "formattingType": this.formattingType,
      "encodingCharacterSet": this.encodingCharacterSet,
      "upcEanDeblur": this.upcEanDeblur,
      "enableMisshaped1D": this.enableMisshaped1D
    }

    return map;
  }

  setROI(x: number, y: number, width: number, height: number) {
    this.roiX = x;
    this.roiY = y;
    this.roiWidth = width;
    this.roiHeight = height;
  }
}

}









  




