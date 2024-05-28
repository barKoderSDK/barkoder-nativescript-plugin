import {  BarkoderConstants } from './barkoder-nativescript.common';
import { View} from '@nativescript/core';
import { ios } from '@nativescript/core/application';


export class BarkoderViewIOS extends View{
    public bkdView : BarkoderView;
    public licenseKeyProperty: any;
    private _licenseKey: string;

    constructor() {
        super();
        this.bkdView = BarkoderView.new();
        this.nativeView = this.bkdView;
    }

    startScanning(callback: BarkoderConstants.BarkoderResultCallback): void {
        const resultDelegate = new BarkoderViewWraper(callback);
        ios.delegate = resultDelegate
        this.bkdView.startScanningError(resultDelegate);    
    }

    stopScanning(): void {
        this.bkdView.stopScanning();
    }

    pauseScanning() : void {
        this.bkdView.pauseScanning();
    }

    isFlashAvailable(callback : BarkoderConstants.FlashAvailableCallback): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.bkdView.isFlashAvailable((flashAvailable: boolean) => {
                resolve(flashAvailable);
                callback.onFlashAvailable(flashAvailable)
            });
        });
    }

    setFlashEnabled(enabled : boolean) : void {
        this.bkdView.setFlash(enabled)
    }

    getMaxZoomFactor(callback : BarkoderConstants.MaxZoomAvailableCallback): Promise<number> {
        return new Promise((resolve, reject) => {
            this.bkdView.getMaxZoomFactor((maxZoomFactor: number) => {
                resolve(maxZoomFactor);
                callback.onMaxZoomAvailable(maxZoomFactor)
            });
        });
    }

    setZoomFactor(zoomFactor : number) : void {
        this.bkdView.setZoomFactor(zoomFactor)
    }

    getLocationLineColorHex() : any {
        return this.bkdView.config.locationLineColor
     }

    setLocationLineColor(locationLineHexColor : string) : void {
        const uiColor = this.hexToUIColor(locationLineHexColor);
        this.bkdView.config.locationLineColor = uiColor 
     }

     setRoiLineColor(roiLineHexColor: string): void {
        const uiColor = this.hexToUIColor(roiLineHexColor);
        this.bkdView.config.roiLineColor = uiColor;
    }

    setRoiLineWidth(roiLineWidth : number) : void {
        this.bkdView.config.roiLineWidth = roiLineWidth;
      }   

    setRoiOverlayBackgroundColor(roiLineHexColor: string) : void {
        const uiColor = this.hexToUIColor(roiLineHexColor);
        this.bkdView.config.roiOverlayBackgroundColor = uiColor;
    }

    setCloseSessionOnResultEnabled(enabled : boolean) : void {
        this.bkdView.config.closeSessionOnResultEnabled = enabled
    }

    setImageResultEnabled(enabled : boolean) : void {
        this.bkdView.config.imageResultEnabled = enabled
    }

    setLocationInImageResultEnabled(enabled : boolean) : void {
        this.bkdView.config.locationInImageResultEnabled = enabled
    }

    setLocationInPreviewEnabled(enabled : boolean) : void {
        this.bkdView.config.locationInPreviewEnabled = enabled
    }
    
    setPinchToZoomEnabled(enabled : boolean) : void {
        this.bkdView.config.pinchToZoomEnabled = enabled
    }

    setRegionOfInterestVisible(enabled : boolean) : void {
        this.bkdView.config.regionOfInterestVisible = enabled
    }

    setRegionOfInterest(
        left : number, top : number, width : number, height : number
        ) : void {

            const rect = {
                origin: { x: left, y: top },
                size: { width: width, height: height }
            };

             this.bkdView.config.setRegionOfInterestError(
                rect
                );
        }

    setBeepOnSuccessEnabled(enabled : boolean) : void {
        this.bkdView.config.beepOnSuccessEnabled = enabled
    }
    
    setVibrateOnSuccessEnabled(enabled : boolean) : void {
        this.bkdView.config.vibrateOnSuccessEnabled = enabled
    }

    getEncodingCharacterSet() : any {
       return this.bkdView.config.decoderConfig.encodingCharacterSet
    }

    getDecodingSpeed() : any {
        return this.bkdView.config.decoderConfig.decodingSpeed
    }

    getFormattingType() : any {
        return this.bkdView.config.decoderConfig.formatting
    }

    setLocationLineWidth(width : number) : void {
        this.bkdView.config.locationLineWidth = width
    }

    getLocationLineWidth() : any {
        return this.bkdView.config.locationLineWidth
    }

    getRoiLineColorHex() : any {
        return this.bkdView.config.roiLineColor
    }

    getRoiLineWidth() : any {
        return this.bkdView.config.roiLineWidth
    }

    getRoiOverlayBackgroundColorHex() : any {
        return this.bkdView.config.roiOverlayBackgroundColor
    }

    isCloseSessionOnResultEnabled() : any {
        return this.bkdView.config.closeSessionOnResultEnabled
    }

    isImageResultEnabled() : any {
        return this.bkdView.config.imageResultEnabled
    }

    isLocationInImageResultEnabled() : any {
        return this.bkdView.config.locationInImageResultEnabled
    }

    getRegionOfInterest() : any {
        return this.bkdView.config.getRegionOfInterest
    }

    getThreadsLimit() : any {
        return this.bkdView.config.getThreadsLimit()
    }

     setThreadsLimit(threadsLimit : number) : void {
        this.bkdView.config.setThreadsLimitError(threadsLimit)
    }

    isLocationInPreviewEnabled() : any {
        return this.bkdView.config.locationInPreviewEnabled
    }

    isPinchToZoomEnabled() : any {
        return this.bkdView.config.pinchToZoomEnabled
    }

    isRegionOfInterestVisible() : any {
        return this.bkdView.config.regionOfInterestVisible
    }

    isBeepOnSuccessEnabled() : any {
        return this.bkdView.config.beepOnSuccessEnabled
    }

    isVibrateOnSuccessEnabled() : any {
        return this.bkdView.config.vibrateOnSuccessEnabled
    }

    getVersion() : any {
        return iBarkoder.GetVersion()
    }

    getMsiCheckSumType() : any { 
        return this.bkdView.config.decoderConfig.msi.checksum
    }

    getCode39CheckSumType() : any {
        return this.bkdView.config.decoderConfig.code39.checksum
    }

    getCode11CheckSumType() : any {
        return this.bkdView.config.decoderConfig.code11.checksum
    }

    setBarkoderResolution(barkoderResolution: BarkoderConstants.BarkoderResolution): void {
   
            if (barkoderResolution === BarkoderConstants.BarkoderResolution.NORMAL) {
                this.bkdView.config.barkoderResolution = 0;
            } else if (barkoderResolution === BarkoderConstants.BarkoderResolution.HIGH) {
                this.bkdView.config.barkoderResolution = 1;
            } 
        } 

    getBarkoderResolution() : any {
       return this.bkdView.config.barkoderResolution
    }

    setEncodingCharacterSet(encodingCharacterSet : any) : void {
        this.bkdView.config.encodingCharacterSet = encodingCharacterSet
    }

    setDecodingSpeed(decodingSpeed : BarkoderConstants.DecodingSpeed) : void {
        if(decodingSpeed == BarkoderConstants.DecodingSpeed.Fast) {
            this.bkdView.config.decoderConfig.decodingSpeed = 0
        } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Normal) {
            this.bkdView.config.decoderConfig.decodingSpeed = 1
        } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Slow) {
            this.bkdView.config.decoderConfig.decodingSpeed = 2
        }
    }

    setFormattingType(formattingType : BarkoderConstants.FormattingType) : void {
        switch (formattingType) {
            case BarkoderConstants.FormattingType.Disabled:
            this.bkdView.config.decoderConfig.formatting = 0
            break;
            case BarkoderConstants.FormattingType.Automatic:
            this.bkdView.config.decoderConfig.formatting = 1
            break;
            case BarkoderConstants.FormattingType.GS1:
            this.bkdView.config.decoderConfig.formatting = 2
            break;
            case BarkoderConstants.FormattingType.AAMVA:
            this.bkdView.config.decoderConfig.formatting = 3
            break;
       }
    }

    setMsiCheckSumType(msiCheckSumType : BarkoderConstants.MsiChecksumType) {
        switch (msiCheckSumType) {
                case BarkoderConstants.MsiChecksumType.Disabled:
                this.bkdView.config.decoderConfig.msi.checksum = 0
                break;
                case BarkoderConstants.MsiChecksumType.Mod10:
                this.bkdView.config.decoderConfig.msi.checksum = 1
                break;
                case BarkoderConstants.MsiChecksumType.Mod11:
                this.bkdView.config.decoderConfig.msi.checksum = 2
                break;
                case BarkoderConstants.MsiChecksumType.Mod1010:
                this.bkdView.config.decoderConfig.msi.checksum = 3
                break;
                case BarkoderConstants.MsiChecksumType.Mod1110:
                this.bkdView.config.decoderConfig.msi.checksum = 4
                break;
                case BarkoderConstants.MsiChecksumType.Mod11IBM:
                this.bkdView.config.decoderConfig.msi.checksum = 5
                break;
                case BarkoderConstants.MsiChecksumType.Mod1110IBM:
                this.bkdView.config.decoderConfig.msi.checksum = 6
                break;
        }
    }

    setCode39CheckSumType(standardCheckSumType : BarkoderConstants.Code39ChecksumType) {
        switch(standardCheckSumType) {
            case BarkoderConstants.Code39ChecksumType.Disabled:
                this.bkdView.config.decoderConfig.code39.checksum = 0
                break;
            case BarkoderConstants.Code39ChecksumType.Enabled:
                 this.bkdView.config.decoderConfig.code39.checksum = 1
                break;
        }
    }

    setCode11CheckSumType(code11CheckSumType : BarkoderConstants.Code11ChecksumType) {
        switch(code11CheckSumType) {
            case BarkoderConstants.Code11ChecksumType.Disabled:
                this.bkdView.config.decoderConfig.code11.checksum = 0
                break;
            case BarkoderConstants.Code11ChecksumType.Single:
                this.bkdView.config.decoderConfig.code11.checksum = 1
                break;
            case BarkoderConstants.Code11ChecksumType.Double:
                this.bkdView.config.decoderConfig.code11.checksum = 2
                break;
        }
    }

    isBarcodeTypeEnabled(decoder: BarkoderConstants.DecoderType) : any {
        switch (decoder) {
            case BarkoderConstants.DecoderType.Aztec:
                return this.bkdView.config.decoderConfig.aztec.enabled;
            case BarkoderConstants.DecoderType.AztecCompact:
                return this.bkdView.config.decoderConfig.aztecCompact.enabled;
            case BarkoderConstants.DecoderType.QR:
                return this.bkdView.config.decoderConfig.qr.enabled;
            case BarkoderConstants.DecoderType.QRMicro:
                return this.bkdView.config.decoderConfig.qrMicro.enabled;
            case BarkoderConstants.DecoderType.Code128:
                return this.bkdView.config.decoderConfig.code128.enabled;
            case BarkoderConstants.DecoderType.Code93:
                return this.bkdView.config.decoderConfig.code93.enabled;
            case BarkoderConstants.DecoderType.Code39:
                return this.bkdView.config.decoderConfig.code39.enabled;
            case BarkoderConstants.DecoderType.Telepen:
                return this.bkdView.config.decoderConfig.telepen.enabled;
            case BarkoderConstants.DecoderType.Code11:
                return this.bkdView.config.decoderConfig.code11.enabled;
            case BarkoderConstants.DecoderType.Msi:
                return this.bkdView.config.decoderConfig.msi.enabled;
            case BarkoderConstants.DecoderType.UpcA:
                return this.bkdView.config.decoderConfig.upcA.enabled;
            case BarkoderConstants.DecoderType.UpcE:
                return this.bkdView.config.decoderConfig.upcE.enabled;
            case BarkoderConstants.DecoderType.UpcE1:
                return this.bkdView.config.decoderConfig.upcE1.enabled;
            case BarkoderConstants.DecoderType.Ean13:
                return this.bkdView.config.decoderConfig.ean13.enabled;
            case BarkoderConstants.DecoderType.Ean8:
                return this.bkdView.config.decoderConfig.ean8.enabled;
            case BarkoderConstants.DecoderType.PDF417:
                return this.bkdView.config.decoderConfig.PDF417.enabled;
            case BarkoderConstants.DecoderType.PDF417Micro:
                return this.bkdView.config.decoderConfig.PDF417Micro.enabled;
            case BarkoderConstants.DecoderType.Datamatrix:
                return this.bkdView.config.decoderConfig.datamatrix.enabled;
            case BarkoderConstants.DecoderType.Code25:
                return this.bkdView.config.decoderConfig.code25.enabled;
            case BarkoderConstants.DecoderType.Interleaved25:
                return this.bkdView.config.decoderConfig.interleaved25.enabled;
            case BarkoderConstants.DecoderType.ITF14:
                return this.bkdView.config.decoderConfig.itf14.enabled;
            case BarkoderConstants.DecoderType.IATA25:
                return this.bkdView.config.decoderConfig.iata25.enabled;
            case BarkoderConstants.DecoderType.Matrix25:
                return this.bkdView.config.decoderConfig.matrix25.enabled;
            case BarkoderConstants.DecoderType.Datalogic25:
                return this.bkdView.config.decoderConfig.datalogic25.enabled;
            case BarkoderConstants.DecoderType.COOP25:
                return this.bkdView.config.decoderConfig.coop25.enabled;
            case BarkoderConstants.DecoderType.Dotcode:
                return this.bkdView.config.decoderConfig.dotcode.enabled;
        }
    }

    setBarcodeTypeEnabled(decoders: BarkoderConstants.DecoderType[]): void {
        this.bkdView.config.decoderConfig.aztec.enabled = false;
        this.bkdView.config.decoderConfig.aztecCompact.enabled = false;
        this.bkdView.config.decoderConfig.qr.enabled = false;
        this.bkdView.config.decoderConfig.qrMicro.enabled = false;
        this.bkdView.config.decoderConfig.code128.enabled = false;
        this.bkdView.config.decoderConfig.code93.enabled = false;
        this.bkdView.config.decoderConfig.code39.enabled = false;
        this.bkdView.config.decoderConfig.telepen.enabled = false;
        this.bkdView.config.decoderConfig.code11.enabled = false;
        this.bkdView.config.decoderConfig.codabar.enabled = false;
        this.bkdView.config.decoderConfig.msi.enabled = false;
        this.bkdView.config.decoderConfig.upcA.enabled = false;
        this.bkdView.config.decoderConfig.upcE.enabled = false;
        this.bkdView.config.decoderConfig.upcE1.enabled = false;
        this.bkdView.config.decoderConfig.ean13.enabled = true;
        this.bkdView.config.decoderConfig.ean8.enabled = false;
        this.bkdView.config.decoderConfig.PDF417.enabled = false;
        this.bkdView.config.decoderConfig.PDF417Micro.enabled = false;
        this.bkdView.config.decoderConfig.datamatrix.enabled = false;
        this.bkdView.config.decoderConfig.code25.enabled = false;
        this.bkdView.config.decoderConfig.interleaved25.enabled = false;
        this.bkdView.config.decoderConfig.itf14.enabled = false;
        this.bkdView.config.decoderConfig.iata25.enabled = false;
        this.bkdView.config.decoderConfig.matrix25.enabled = false;
        this.bkdView.config.decoderConfig.datalogic25.enabled = false;
        this.bkdView.config.decoderConfig.coop25.enabled = false;
        this.bkdView.config.decoderConfig.dotcode.enabled = false;
        this.bkdView.config.decoderConfig.code32.enabled = false;
        decoders.forEach((dt: BarkoderConstants.DecoderType) => {
            switch (dt) {
                case BarkoderConstants.DecoderType.Aztec:
                    this.bkdView.config.decoderConfig.aztec.enabled = true
                    break;
                case BarkoderConstants.DecoderType.AztecCompact:
                    this.bkdView.config.decoderConfig.aztecCompact.enabled = true
                    break;
                case BarkoderConstants.DecoderType.QR:
                    this.bkdView.config.decoderConfig.qr.enabled = true
                    break;
                case BarkoderConstants.DecoderType.QRMicro:
                    this.bkdView.config.decoderConfig.qrMicro.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Code128:
                    this.bkdView.config.decoderConfig.code128.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Code93:
                    this.bkdView.config.decoderConfig.code93.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Code39:
                    this.bkdView.config.decoderConfig.code39.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Telepen:
                    this.bkdView.config.decoderConfig.telepen.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Code11:
                    this.bkdView.config.decoderConfig.code11.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Msi:
                    this.bkdView.config.decoderConfig.msi.enabled = true
                    break;
                case BarkoderConstants.DecoderType.UpcA:
                    this.bkdView.config.decoderConfig.upcA.enabled = true
                    break;
                case BarkoderConstants.DecoderType.UpcE:
                    this.bkdView.config.decoderConfig.upcE.enabled = true
                    break;
                case BarkoderConstants.DecoderType.UpcE1:
                    this.bkdView.config.decoderConfig.upcE1.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Ean13:
                    this.bkdView.config.decoderConfig.ean13.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Ean8:
                    this.bkdView.config.decoderConfig.ean8.enabled = true
                    break;
                case BarkoderConstants.DecoderType.PDF417:
                    this.bkdView.config.decoderConfig.PDF417.enabled = true
                    break;
                case BarkoderConstants.DecoderType.PDF417Micro:
                    this.bkdView.config.decoderConfig.PDF417Micro.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Datamatrix:
                    this.bkdView.config.decoderConfig.datamatrix.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Code25:
                    this.bkdView.config.decoderConfig.code25.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Interleaved25:
                    this.bkdView.config.decoderConfig.interleaved25.enabled = true
                    break;
                case BarkoderConstants.DecoderType.ITF14:
                    this.bkdView.config.decoderConfig.itf14.enabled = true
                    break;
                case BarkoderConstants.DecoderType.IATA25:
                    this.bkdView.config.decoderConfig.iata25.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Matrix25:
                    this.bkdView.config.decoderConfig.matrix25.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Datalogic25:
                    this.bkdView.config.decoderConfig.datalogic25.enabled = true
                    break;
                case BarkoderConstants.DecoderType.COOP25:
                    this.bkdView.config.decoderConfig.coop25.enabled = true
                    break;
                case BarkoderConstants.DecoderType.Dotcode:
                    this.bkdView.config.decoderConfig.dotcode.enabled = true
                    break;
                    default:
                        break;
            }
        });
      }

      getBarcodeTypeMaximumLenght(decoder: BarkoderConstants.DecoderType) : any {
        switch (decoder) {
            case BarkoderConstants.DecoderType.Aztec:
                return this.bkdView.config.decoderConfig.aztec.maximumLength;
            case BarkoderConstants.DecoderType.AztecCompact:
                return this.bkdView.config.decoderConfig.aztecCompact.maximumLength;
            case BarkoderConstants.DecoderType.QR:
                return this.bkdView.config.decoderConfig.qr.maximumLength;
            case BarkoderConstants.DecoderType.QRMicro:
                return this.bkdView.config.decoderConfig.qrMicro.maximumLength;
            case BarkoderConstants.DecoderType.Code128:
                return this.bkdView.config.decoderConfig.code128.maximumLength;
            case BarkoderConstants.DecoderType.Code93:
                return this.bkdView.config.decoderConfig.code93.maximumLength;
            case BarkoderConstants.DecoderType.Code39:
                return this.bkdView.config.decoderConfig.code39.maximumLength;
            case BarkoderConstants.DecoderType.Telepen:
                return this.bkdView.config.decoderConfig.telepen.maximumLength;
            case BarkoderConstants.DecoderType.Code11:
                return this.bkdView.config.decoderConfig.code11.maximumLength;
            case BarkoderConstants.DecoderType.Msi:
                return this.bkdView.config.decoderConfig.msi.maximumLength;
            case BarkoderConstants.DecoderType.UpcA:
                return this.bkdView.config.decoderConfig.upcA.maximumLength;
            case BarkoderConstants.DecoderType.UpcE:
                return this.bkdView.config.decoderConfig.upcE.maximumLength;
            case BarkoderConstants.DecoderType.UpcE1:
                return this.bkdView.config.decoderConfig.upcE1.maximumLength;
            case BarkoderConstants.DecoderType.Ean13:
                return this.bkdView.config.decoderConfig.ean13.maximumLength;
            case BarkoderConstants.DecoderType.Ean8:
                return this.bkdView.config.decoderConfig.ean8.maximumLength;
            case BarkoderConstants.DecoderType.PDF417:
                return this.bkdView.config.decoderConfig.PDF417.maximumLength;
            case BarkoderConstants.DecoderType.PDF417Micro:
                return this.bkdView.config.decoderConfig.PDF417Micro.maximumLength;
            case BarkoderConstants.DecoderType.Datamatrix:
                return this.bkdView.config.decoderConfig.datamatrix.maximumLength;
            case BarkoderConstants.DecoderType.Code25:
                return this.bkdView.config.decoderConfig.code25.maximumLength;
            case BarkoderConstants.DecoderType.Interleaved25:
                return this.bkdView.config.decoderConfig.interleaved25.maximumLength;
            case BarkoderConstants.DecoderType.ITF14:
                return this.bkdView.config.decoderConfig.itf14.maximumLength;
            case BarkoderConstants.DecoderType.IATA25:
                return this.bkdView.config.decoderConfig.iata25.maximumLength;
            case BarkoderConstants.DecoderType.Matrix25:
                return this.bkdView.config.decoderConfig.matrix25.maximumLength;
            case BarkoderConstants.DecoderType.Datalogic25:
                return this.bkdView.config.decoderConfig.datalogic25.maximumLength;
            case BarkoderConstants.DecoderType.COOP25:
                return this.bkdView.config.decoderConfig.coop25.maximumLength;
            case BarkoderConstants.DecoderType.Dotcode:
                return this.bkdView.config.decoderConfig.dotcode.maximumLength;
        }
    }

    getBarcodeTypeMinimumLenght(decoder: BarkoderConstants.DecoderType) : any {
        switch (decoder) {
            case BarkoderConstants.DecoderType.Aztec:
                return this.bkdView.config.decoderConfig.aztec.minimumLength;
            case BarkoderConstants.DecoderType.AztecCompact:
                return this.bkdView.config.decoderConfig.aztecCompact.minimumLength;
            case BarkoderConstants.DecoderType.QR:
                return this.bkdView.config.decoderConfig.qr.minimumLength;
            case BarkoderConstants.DecoderType.QRMicro:
                return this.bkdView.config.decoderConfig.qrMicro.minimumLength;
            case BarkoderConstants.DecoderType.Code128:
                return this.bkdView.config.decoderConfig.code128.minimumLength;
            case BarkoderConstants.DecoderType.Code93:
                return this.bkdView.config.decoderConfig.code93.minimumLength;
            case BarkoderConstants.DecoderType.Code39:
                return this.bkdView.config.decoderConfig.code39.minimumLength;
            case BarkoderConstants.DecoderType.Telepen:
                return this.bkdView.config.decoderConfig.telepen.minimumLength;
            case BarkoderConstants.DecoderType.Code11:
                return this.bkdView.config.decoderConfig.code11.minimumLength;
            case BarkoderConstants.DecoderType.Msi:
                return this.bkdView.config.decoderConfig.msi.minimumLength;
            case BarkoderConstants.DecoderType.UpcA:
                return this.bkdView.config.decoderConfig.upcA.minimumLength;
            case BarkoderConstants.DecoderType.UpcE:
                return this.bkdView.config.decoderConfig.upcE.minimumLength;
            case BarkoderConstants.DecoderType.UpcE1:
                return this.bkdView.config.decoderConfig.upcE1.minimumLength;
            case BarkoderConstants.DecoderType.Ean13:
                return this.bkdView.config.decoderConfig.ean13.minimumLength;
            case BarkoderConstants.DecoderType.Ean8:
                return this.bkdView.config.decoderConfig.ean8.minimumLength;
            case BarkoderConstants.DecoderType.PDF417:
                return this.bkdView.config.decoderConfig.PDF417.minimumLength;
            case BarkoderConstants.DecoderType.PDF417Micro:
                return this.bkdView.config.decoderConfig.PDF417Micro.minimumLength;
            case BarkoderConstants.DecoderType.Datamatrix:
                return this.bkdView.config.decoderConfig.datamatrix.minimumLength;
            case BarkoderConstants.DecoderType.Code25:
                return this.bkdView.config.decoderConfig.code25.minimumLength;
            case BarkoderConstants.DecoderType.Interleaved25:
                return this.bkdView.config.decoderConfig.interleaved25.minimumLength;
            case BarkoderConstants.DecoderType.ITF14:
                return this.bkdView.config.decoderConfig.itf14.minimumLength;
            case BarkoderConstants.DecoderType.IATA25:
                return this.bkdView.config.decoderConfig.iata25.minimumLength;
            case BarkoderConstants.DecoderType.Matrix25:
                return this.bkdView.config.decoderConfig.matrix25.minimumLength;
            case BarkoderConstants.DecoderType.Datalogic25:
                return this.bkdView.config.decoderConfig.datalogic25.minimumLength;
            case BarkoderConstants.DecoderType.COOP25:
                return this.bkdView.config.decoderConfig.coop25.minimumLength;
            case BarkoderConstants.DecoderType.Dotcode:
                return this.bkdView.config.decoderConfig.dotcode.minimumLength;
        }
    }
    

    setBarcodeTypeLengthRange(decoder: BarkoderConstants.DecoderType, minimumLength:number, maximumLength: number) {
        switch (decoder) {
            case BarkoderConstants.DecoderType.Aztec:
                this.bkdView.config.decoderConfig.aztec.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.AztecCompact:
                this.bkdView.config.decoderConfig.aztecCompact.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.QR:
                this.bkdView.config.decoderConfig.qr.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.QRMicro:
                this.bkdView.config.decoderConfig.qrMicro.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
                case BarkoderConstants.DecoderType.Code128:
                    this.bkdView.config.decoderConfig.code128.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Code93:
                this.bkdView.config.decoderConfig.code93.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Code39:
                this.bkdView.config.decoderConfig.code39.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Telepen:
                this.bkdView.config.decoderConfig.telepen.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
                case BarkoderConstants.DecoderType.Code11:
                    this.bkdView.config.decoderConfig.code11.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Msi:
                this.bkdView.config.decoderConfig.msi.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.UpcA:
                this.bkdView.config.decoderConfig.upcA.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.UpcE:
                this.bkdView.config.decoderConfig.upcE.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
                case BarkoderConstants.DecoderType.UpcE1:
                    this.bkdView.config.decoderConfig.upcE1.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Ean13:
                this.bkdView.config.decoderConfig.ean13.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Ean8:
                this.bkdView.config.decoderConfig.ean8.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.PDF417:
                this.bkdView.config.decoderConfig.PDF417.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
                case BarkoderConstants.DecoderType.PDF417Micro:
                    this.bkdView.config.decoderConfig.PDF417Micro.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
                case BarkoderConstants.DecoderType.Datamatrix:
                    this.bkdView.config.decoderConfig.datamatrix.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Code25:
                this.bkdView.config.decoderConfig.code25.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Interleaved25:
                this.bkdView.config.decoderConfig.interleaved25.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.ITF14:
                this.bkdView.config.decoderConfig.itf14.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
                case BarkoderConstants.DecoderType.IATA25:
                    this.bkdView.config.decoderConfig.iata25.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Matrix25:
                this.bkdView.config.decoderConfig.matrix25.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.Datalogic25:
                this.bkdView.config.decoderConfig.datalogic25.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
            case BarkoderConstants.DecoderType.COOP25:
                this.bkdView.config.decoderConfig.coop25.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                break;
                case BarkoderConstants.DecoderType.Dotcode:
                    this.bkdView.config.decoderConfig.dotcode.setLengthRangeWithMinimumMaximum(minimumLength,maximumLength)
                    break;
                default:
                    break;
        }
    }

    setMaximumResultsCount(maximumResultsCount : number): void {
        this.bkdView.config.decoderConfig.maximumResultsCount = maximumResultsCount
    }
    setDuplicatesDelayMs(duplicateDelayMs : number) : void {
        this.bkdView.config.decoderConfig.duplicatesDelayMs = duplicateDelayMs
    }

    setMulticodeCachingDuration(multicodeCachingDuration : number) : void {
        this.bkdView.config.setMulticodeCachingDuration(multicodeCachingDuration)
    }

    setMulticodeCachingEnabled(multiCodeCachingEnabled : boolean) : void {
        this.bkdView.config.setMulticodeCachingEnabled(multiCodeCachingEnabled)
    }

    setDatamatrixDpmModeEnabled(dpmModeEnabled : boolean) : void {
        if(dpmModeEnabled) {
            this.bkdView.config.decoderConfig.datamatrix.dpmMode = 1
        } else if (dpmModeEnabled == false) {
            this.bkdView.config.decoderConfig.datamatrix.dpmMode = 0
        }
        
    }

    getDuplicatesDelayMs() : any {
        return this.bkdView.config.decoderConfig.duplicatesDelayMs
     }

    getMaximumResultsCount() : any {
        return this.bkdView.config.decoderConfig.maximumResultsCount
    }

    setUpcEanDeblurEnabled(enabled : boolean) : void {
        this.bkdView.config.decoderConfig.upcEanDeblur = enabled
    }

    setEnableMisshaped1DEnabled(enabled : boolean) : void {
        this.bkdView.config.decoderConfig.enableMisshaped1D = enabled
    }

    setBarcodeThumbnailOnResultEnabled(enabled : boolean) : void{
        this.bkdView.config.barcodeThumbnailOnResult = enabled
       }

    isBarcodeThumbnailOnResultEnabled() : any{
        return this.bkdView.config.barcodeThumbnailOnResult
       }

    setThresholdBetweenDuplicatesScans(thresholdBetweenDuplicatesScans : number) : void {
        this.bkdView.config.thresholdBetweenDuplicatesScans = thresholdBetweenDuplicatesScans
    }
    
    getThresholdBetweenDuplicatesScans() : any {
        return this.bkdView.config.thresholdBetweenDuplicatesScans
    }

    getMulticodeCachingEnabled() : any {
        return this.bkdView.config.getMulticodeCachingEnabled()
    }
    
    getMulticodeCachingDuration() : any {
        return this.bkdView.config.getMulticodeCachingDuration()
       }

    isUpcEanDeblurEnabled() : any {
        return this.bkdView.config.decoderConfig.upcEanDeblur
    }
    
    isMisshaped1DEnabled() : any { 
        return this.bkdView.config.decoderConfig.enableMisshaped1D
    }

    isVINRestrictionsEnabled() : any {
        return this.bkdView.config.decoderConfig.enableVINRestrictions
    }

    setEnableVINRestrictions(vinRestrictionsEnabled: boolean) : void {
        this.bkdView.config.decoderConfig.enableVINRestrictions = vinRestrictionsEnabled
    }
    

    setLicenseKey(licenseKey : string): void {
        const config = new BarkoderConfig({
            licenseKey: licenseKey,
            licenseCheckHandler: (result: LicenseCheckResult) => {
            }
        });
      
        this.bkdView.config = config
    } 

    configureBarkoder(config : BarkoderConstants.BarkoderConfig) : void {
        console.log(`${config.toJsonString()}`)
            const nsString = NSString.stringWithString(config.toJsonString());
            const jsonData = nsString.dataUsingEncoding(NSUTF8StringEncoding);
            BarkoderHelper.applyConfigSettingsFromJsonJsonDataFinished(this.bkdView.config, jsonData, (resultConfig: BarkoderConfig, error: NSError) => {
                if (error) {
                    console.error('Error applying config settings:', error.localizedDescription);
                } else {
                    console.log('Config settings applied successfully:', resultConfig);
                }
            });
      }

    private hexToUIColor(hexColor: string): UIColor {
        hexColor = hexColor.replace("#", "");
        const red = parseInt(hexColor.substring(0, 2), 16) / 255.0;
        const green = parseInt(hexColor.substring(2, 4), 16) / 255.0;
        const blue = parseInt(hexColor.substring(4, 6), 16) / 255.0;
        return new UIColor({ red: red, green: green, blue: blue, alpha: 1 });
    }

    private getPropertiesAndMethods(obj: any): void {
        const propertiesAndMethods: string[] = [];
        
        for (let key in obj) {
            console.log(`Key: ${key}, Value: ${obj[key]}`);
        }
    }
}

@NativeClass
export class BarkoderViewWraper extends UIResponder implements BarkoderResultDelegate{
    public callback : any
    static ObjCProtocols = [BarkoderResultDelegate];

    constructor(callback : BarkoderConstants.BarkoderResultCallback) {
        super();
        this.callback = callback
    
    }
    
    scanningFinishedThumbnailsImage(decoderResults: NSArray<DecoderResult> | DecoderResult[], thumbnails: NSArray<UIImage> | UIImage[], image: UIImage): void {
        console.log(decoderResults[0].textualData)
        this.callback.scanningFinished(decoderResults, thumbnails, image);
    }
    

    static new(): BarkoderViewWraper {
        return super.new.call(this);
    }
}


