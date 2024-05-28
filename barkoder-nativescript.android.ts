import { BarkoderConstants } from './barkoder-nativescript.common';
import * as application from "@nativescript/core/application";
import { View } from '@nativescript/core';
import { BarkoderView } from './barkoder-nativescript.common';

const androidSupport = global.androidx && global.androidx.appcompat ? global.androidx.core.app : android.support.v4.app;
declare const com, global: any;

const context = application.android.context;
const Manifest = android.Manifest;


export class BarkoderViewAndroid extends View {
    public bkdView : any
    public bkd : any
    public bkdConfig : any
    public bkdHelper : any
    
    constructor() {
        super();
        this.bkdConfig = com.barkoder.BarkoderConfig
        this.bkd = new com.barkoder.Barkoder()
        this.bkdView = new com.barkoder.BarkoderView(context, true)
        this.bkdView.config = new com.barkoder.BarkoderConfig(context, "asdad", null);
        this.bkdHelper = new com.barkoder.BarkoderHelper()
        // console.log(this._licenseKey)
        this.nativeView = this.bkdView
       
    }

    startScanning(BarkoderResultCallback: BarkoderConstants.BarkoderResultCallback): void {
        const resultCallback = new com.barkoder.interfaces.BarkoderResultCallback({
            scanningFinished: (results: any[], thumbnails: any[], resultImage: any) => {
                BarkoderResultCallback.scanningFinished(results, thumbnails, resultImage);
            }
        });
        this.bkdView.startScanning(resultCallback);
    }

    stopScanning(): void {
        this.bkdView.stopScanning()
    }

    pauseScanning() : void {
        this.bkdView.pauseScanning()
    }

    isFlashAvailable(callback : BarkoderConstants.FlashAvailableCallback) {
        const isFlashAvailableCallback = new com.barkoder.interfaces.FlashAvailableCallback({
            onFlashAvailable: (isFlashAvailable: any) => {
                callback.onFlashAvailable(isFlashAvailable)
            }
        });
        this.bkdView.isFlashAvailable(isFlashAvailableCallback)
    }

    setFlashEnabled(enabled : boolean) : void  {
        this.bkdView.setFlashEnabled(enabled)
    }

    getMaxZoomFactor(callback : BarkoderConstants.MaxZoomAvailableCallback) {
        const MaxZoomCallback = new com.barkoder.interfaces.MaxZoomAvailableCallback({
            onMaxZoomAvailable: (maxZoomFacttor: any) => {
                callback.onMaxZoomAvailable(maxZoomFacttor)
            }
        });
        this.bkdView.getMaxZoomFactor(MaxZoomCallback)
    }

    setZoomFactor(zoomFactor : number) : void {
        this.bkdView.setZoomFactor(zoomFactor)
    }

    getLocationLineColorHex() : any {
        return this.bkdView.config.getLocationLineColor()     
     }

    setLocationLineColor(locationLineColor : string) : void {
        const locationColor = this.hexToAndroidColor(locationLineColor)
        this.bkdView.config.setLocationLineColor(locationColor)  
     }
     
    setRoiLineColor(roiLineColor: string) : void {
        const roiLineColorHex = this.hexToAndroidColor(roiLineColor)
        this.bkdView.config.setRoiLineColor(roiLineColorHex)
    } 

    setRoiLineWidth(roiLineWidth : number) : void {
        this.bkdView.config.setRoiLineWidth(roiLineWidth)
      }

    setRoiOverlayBackgroundColor(roiOverlayBackgroundColor) : void {
        const roiOberlayBackgroundColor = this.hexToAndroidColor(roiOverlayBackgroundColor)
        this.bkdView.config.setRoiOverlayBackgroundColor(roiOberlayBackgroundColor)
    }  

    setCloseSessionOnResultEnabled(enabled : boolean) : void {
        this.bkdView.config.setCloseSessionOnResultEnabled(enabled)
     }
    
    setImageResultEnabled(enabled : boolean): void {
        this.bkdView.config.setImageResultEnabled(enabled);  
     }

     setLocationInImageResultEnabled(enabled : boolean) : void {
        this.bkdView.config.setLocationInImageResultEnabled(enabled)
       }

    setLocationInPreviewEnabled(enabled : boolean) : void {
        this.bkdView.config.setLocationInPreviewEnabled(enabled)
       }   

    setPinchToZoomEnabled(enabled : boolean) : void {
        this.bkdView.config.setPinchToZoomEnabled(enabled)
       }

    setRegionOfInterestVisible(enabled : boolean) : void {
        this.bkdView.config.setRegionOfInterestVisible(enabled)
       }
       
    setRegionOfInterest(
        left : number, top : number, width : number, height : number
        ) : void {
             this.bkdView.config.setRegionOfInterest(
                left, top, width, height
                );
        }
    
    setBeepOnSuccessEnabled(enabled : boolean) : void {
        this.bkdView.config.setBeepOnSuccessEnabled(enabled)
    }

    setVibrateOnSuccessEnabled(enabled: boolean) : void {
        this.bkdView.config.setVibrateOnSuccessEnabled(enabled)
       }

    getEncodingCharacterSet() : any {
       return this.bkdView.config.getDecoderConfig().encodingCharacterSet     
    }
    
    getDecodingSpeed(): any {
        return  this.bkdView.config.getDecoderConfig().decodingSpeed
     }

    getFormattingType() : any {
        return this.bkdView.config.getDecoderConfig().formattingType
    }

    setLocationLineWidth(width : number) : void {
        const roundedValue = Math.round(width * 100) / 100;
        this.bkdView.config.setLocationLineWidth(roundedValue);
    }

    getLocationLineWidth(): any {
        return this.bkdView.config.getLocationLineWidth();
    }

    getRoiLineWidth() : any {
        return this.bkdView.config.getRoiLineWidth()
    }

    getRoiOverlayBackgroundColorHex() : any {
        return this.bkdView.config.getRoiOverlayBackgroundColor()
    }

    isCloseSessionOnResultEnabled() : any {
        return this.bkdView.config.isCloseSessionOnResultEnabled()
    }

    isImageResultEnabled() : any {
        return this.bkdView.config.isImageResultEnabled()
    }

    isLocationInImageResultEnabled() : any {
        return this.bkdView.config.isLocationInImageResultEnabled()
    }
    
    getRegionOfInterest() : any {
        return this.bkdView.config.getRegionOfInterest()
    }
    
    getThreadsLimit() : any {
       return this.bkdConfig.GetThreadsLimit()
    }
    
    setThreadsLimit(threadsLimit : number) : void {
        this.bkdConfig.SetThreadsLimit(threadsLimit)
    }
    
    isLocationInPreviewEnabled() : Promise <any> {
        return this.bkdView.config.isLocationInPreviewEnabled()
    }

    isPinchToZoomEnabled() : Promise <any> {
        return this.bkdView.config.isPinchToZoomEnabled()
    }

    isRegionOfInterestVisible() : Promise <any> {
        return this.bkdView.config.isRegionOfInterestVisible()
    }

    isBeepOnSuccessEnabled() : Promise <any> {
        return this.bkdView.config.isBeepOnSuccessEnabled()
    }
    
    isVibrateOnSuccessEnabled() : Promise <any> {
        return this.bkdView.config.isVibrateOnSuccessEnabled()
    }
    
    getVersion() : any {
        return com.barkoder.Barkoder.GetVersion()
    }

    getMsiCheckSumType() : any {
        return this.bkdView.config.getDecoderConfig().Msi.checksumType
    }

    getCode39CheckSumType() : any {
        return this.bkdView.config.getDecoderConfig().Code39.checksumType
    }

    getCode11CheckSumType() : any {
        return this.bkdView.config.getDecoderConfig().Code11.checksumType
    }

    setBarkoderResolution(barkoderResolution : BarkoderConstants.BarkoderResolution) : void {
        if(barkoderResolution == BarkoderConstants.BarkoderResolution.NORMAL) {
            this.bkdView.config.setBarkoderResolution(com.barkoder.enums.BarkoderResolution.Normal);
            ;
        } else if (barkoderResolution == BarkoderConstants.BarkoderResolution.HIGH) {
            this.bkdView.config.setBarkoderResolution(com.barkoder.enums.BarkoderResolution.HIGH);
        }
    }

    getBarkoderResolution() : any {
        return this.bkdView.config.getBarkoderResolution()
    }

    setEncodingCharacterSet(encodingCharSet : any) : void {
        this.bkdView.config.getDecoderConfig().encodingCharacterSet = encodingCharSet
    }

    setDecodingSpeed(decodingSpeed: BarkoderConstants.DecodingSpeed): void {
        if(decodingSpeed == BarkoderConstants.DecodingSpeed.Slow) {
            this.bkdView.config.getDecoderConfig().decodingSpeed =
            com.barkoder.Barkoder.DecodingSpeed.Slow;
        } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Fast){
            this.bkdView.config.getDecoderConfig().decodingSpeed =
            com.barkoder.Barkoder.DecodingSpeed.Fast;
        } else if(decodingSpeed == BarkoderConstants.DecodingSpeed.Normal){
            this.bkdView.config.getDecoderConfig().decodingSpeed =
            com.barkoder.Barkoder.DecodingSpeed.Normal;
        } else {
            console.log("Not avilbilable Decoding Speed")
        }
    }

    setFormattingType(formattingType: BarkoderConstants.FormattingType) {
        switch (formattingType) {
            case BarkoderConstants.FormattingType.Disabled:
                this.bkdView.config.getDecoderConfig().formattingType 
                = com.barkoder.Barkoder.FormattingType.Disabled
            break;
            case BarkoderConstants.FormattingType.Automatic:
                this.bkdView.config.getDecoderConfig().formattingType 
                = com.barkoder.Barkoder.FormattingType.Automatic
            break;
            case BarkoderConstants.FormattingType.GS1:
                this.bkdView.config.getDecoderConfig().formattingType 
                = com.barkoder.Barkoder.FormattingType.GS1
            break;
            case BarkoderConstants.FormattingType.AAMVA:
                this.bkdView.config.getDecoderConfig().formattingType 
                = com.barkoder.Barkoder.FormattingType.AAMVA
            break;
       }
    }

    setMsiCheckSumType(msiCheckSumType : BarkoderConstants.MsiChecksumType) {
        switch (msiCheckSumType) {
                case BarkoderConstants.MsiChecksumType.Disabled:
                this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Disabled
                break;
                case BarkoderConstants.MsiChecksumType.Mod10:
                this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod10
                break;
                case BarkoderConstants.MsiChecksumType.Mod11:
                this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod11
                break;
                case BarkoderConstants.MsiChecksumType.Mod1010:
                this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod1010
                break;
                case BarkoderConstants.MsiChecksumType.Mod1110:
                this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod1110
                break;
                case BarkoderConstants.MsiChecksumType.Mod11IBM:
                this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod11IBM
                break;
                case BarkoderConstants.MsiChecksumType.Mod1110IBM:
                this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod1110IBM
                break;
        }
    }

    setCode39CheckSumType(code39ChecksumType : BarkoderConstants.Code39ChecksumType) {
        switch(code39ChecksumType) {
            case BarkoderConstants.Code39ChecksumType.Disabled:
                this.bkdView.config.getDecoderConfig().Code39.checksumType = com.barkoder.Barkoder.Code39ChecksumType.Disabled
                break;
            case BarkoderConstants.Code39ChecksumType.Enabled:
                 this.bkdView.config.getDecoderConfig().Code39.checksumType = com.barkoder.Barkoder.Code39ChecksumType.Enabled
                break;
        }
    }

    setCode11CheckSumType(code11CheckSumType : BarkoderConstants.Code11ChecksumType) {
        switch(code11CheckSumType) {
            case BarkoderConstants.Code11ChecksumType.Disabled:
                this.bkdView.config.getDecoderConfig().Code11.checksumType = com.barkoder.Barkoder.Code11ChecksumType.Disabled
                break;
            case BarkoderConstants.Code11ChecksumType.Single:
                this.bkdView.config.getDecoderConfig().Code11.checksumType = com.barkoder.Barkoder.Code11ChecksumType.Single
                break;
            case BarkoderConstants.Code11ChecksumType.Double:
                this.bkdView.config.getDecoderConfig().Code11.checksumType = com.barkoder.Barkoder.Code11ChecksumType.Double
                break;
        }
    }

    isBarcodeTypeEnabled(decoder: BarkoderConstants.DecoderType) : boolean {
        switch (decoder) {
            case BarkoderConstants.DecoderType.Aztec:
                return this.bkdView.config.getDecoderConfig().Aztec.enabled;
            case BarkoderConstants.DecoderType.AztecCompact:
                return this.bkdView.config.getDecoderConfig().AztecCompact.enabled;
            case BarkoderConstants.DecoderType.QR:
                return this.bkdView.config.getDecoderConfig().QR.enabled;
            case BarkoderConstants.DecoderType.QRMicro:
                return this.bkdView.config.getDecoderConfig().QRMicro.enabled;
            case BarkoderConstants.DecoderType.Code128:
                return this.bkdView.config.getDecoderConfig().Code128.enabled;
            case BarkoderConstants.DecoderType.Code93:
                return this.bkdView.config.getDecoderConfig().Code93.enabled;
            case BarkoderConstants.DecoderType.Code39:
                return this.bkdView.config.getDecoderConfig().Code39.enabled;
            case BarkoderConstants.DecoderType.Telepen:
                return this.bkdView.config.getDecoderConfig().Telepen.enabled;
            case BarkoderConstants.DecoderType.Code11:
                return this.bkdView.config.getDecoderConfig().Code11.enabled;
            case BarkoderConstants.DecoderType.Msi:
                return this.bkdView.config.getDecoderConfig().Msi.enabled;
            case BarkoderConstants.DecoderType.UpcA:
                return this.bkdView.config.getDecoderConfig().UpcA.enabled;
            case BarkoderConstants.DecoderType.UpcE:
                return this.bkdView.config.getDecoderConfig().UpcE.enabled;
            case BarkoderConstants.DecoderType.UpcE1:
                return this.bkdView.config.getDecoderConfig().UpcE1.enabled;
            case BarkoderConstants.DecoderType.Ean13:
                return this.bkdView.config.getDecoderConfig().Ean13.enabled;
            case BarkoderConstants.DecoderType.Ean8:
                return this.bkdView.config.getDecoderConfig().Ean8.enabled;
            case BarkoderConstants.DecoderType.PDF417:
                return this.bkdView.config.getDecoderConfig().PDF417.enabled;
            case BarkoderConstants.DecoderType.PDF417Micro:
                return this.bkdView.config.getDecoderConfig().PDF417Micro.enabled;
            case BarkoderConstants.DecoderType.Datamatrix:
                return this.bkdView.config.getDecoderConfig().Datamatrix.enabled;
            case BarkoderConstants.DecoderType.Code25:
                return this.bkdView.config.getDecoderConfig().Code25.enabled;
            case BarkoderConstants.DecoderType.Interleaved25:
                return this.bkdView.config.getDecoderConfig().Interleaved25.enabled;
            case BarkoderConstants.DecoderType.ITF14:
                return this.bkdView.config.getDecoderConfig().ITF14.enabled;
            case BarkoderConstants.DecoderType.IATA25:
                return this.bkdView.config.getDecoderConfig().IATA25.enabled;
            case BarkoderConstants.DecoderType.Matrix25:
                return this.bkdView.config.getDecoderConfig().Matrix25.enabled;
            case BarkoderConstants.DecoderType.Datalogic25:
                return this.bkdView.config.getDecoderConfig().Datalogic25.enabled;
            case BarkoderConstants.DecoderType.COOP25:
                return this.bkdView.config.getDecoderConfig().COOP25.enabled;
            case BarkoderConstants.DecoderType.Dotcode:
                return this.bkdView.config.getDecoderConfig().Dotcode.enabled;
        }
    }

    setBarcodeTypeEnabled(decoders: BarkoderConstants.DecoderType[]): void {
        this.bkdView.config.getDecoderConfig().Aztec.enabled = false;
        this.bkdView.config.getDecoderConfig().AztecCompact.enabled = false;
        this.bkdView.config.getDecoderConfig().QR.enabled = false;
        this.bkdView.config.getDecoderConfig().QRMicro.enabled = false;
        this.bkdView.config.getDecoderConfig().Code128.enabled = false;
        this.bkdView.config.getDecoderConfig().Code93.enabled = false;
        this.bkdView.config.getDecoderConfig().Code39.enabled = false;
        this.bkdView.config.getDecoderConfig().Telepen.enabled = false;
        this.bkdView.config.getDecoderConfig().Code11.enabled = false;
        this.bkdView.config.getDecoderConfig().Codabar.enabled = false;
        this.bkdView.config.getDecoderConfig().Msi.enabled = false;
        this.bkdView.config.getDecoderConfig().UpcA.enabled = false;
        this.bkdView.config.getDecoderConfig().UpcE.enabled = false;
        this.bkdView.config.getDecoderConfig().UpcE1.enabled = false;
        this.bkdView.config.getDecoderConfig().Ean13.enabled = false;
        this.bkdView.config.getDecoderConfig().Ean8.enabled = false;
        this.bkdView.config.getDecoderConfig().PDF417.enabled = false;
        this.bkdView.config.getDecoderConfig().PDF417Micro.enabled = false;
        this.bkdView.config.getDecoderConfig().Datamatrix.enabled = false;
        this.bkdView.config.getDecoderConfig().Code25.enabled = false;
        this.bkdView.config.getDecoderConfig().Interleaved25.enabled = false;
        this.bkdView.config.getDecoderConfig().ITF14.enabled = false;
        this.bkdView.config.getDecoderConfig().IATA25.enabled = false;
        this.bkdView.config.getDecoderConfig().Matrix25.enabled = false;
        this.bkdView.config.getDecoderConfig().Datalogic25.enabled = false;
        this.bkdView.config.getDecoderConfig().COOP25.enabled = false;
        this.bkdView.config.getDecoderConfig().Dotcode.enabled = false;
        decoders.forEach((dt: BarkoderConstants.DecoderType) => {
            switch (dt) {
                case BarkoderConstants.DecoderType.Aztec:
                    this.bkdView.config.getDecoderConfig().Aztec.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.AztecCompact:
                    this.bkdView.config.getDecoderConfig().AztecCompact.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.QR:
                    this.bkdView.config.getDecoderConfig().QR.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.QRMicro:
                    this.bkdView.config.getDecoderConfig().QRMicro.enabled = true;
                    break;
                    case BarkoderConstants.DecoderType.Code128:
                    this.bkdView.config.getDecoderConfig().Code128.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Code93:
                    this.bkdView.config.getDecoderConfig().Code93.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Code39:
                    this.bkdView.config.getDecoderConfig().Code39.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Telepen:
                    this.bkdView.config.getDecoderConfig().Telepen.enabled = true;
                    break;
                    case BarkoderConstants.DecoderType.Code11:
                    this.bkdView.config.getDecoderConfig().Code11.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Msi:
                    this.bkdView.config.getDecoderConfig().Msi.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.UpcA:
                    this.bkdView.config.getDecoderConfig().UpcA.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.UpcE:
                    this.bkdView.config.getDecoderConfig().UpcE.enabled = true;
                    break;
                    case BarkoderConstants.DecoderType.UpcE1:
                    this.bkdView.config.getDecoderConfig().UpcE1.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Ean13:
                    this.bkdView.config.getDecoderConfig().Ean13.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Ean8:
                    this.bkdView.config.getDecoderConfig().Ean8.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.PDF417:
                    this.bkdView.config.getDecoderConfig().PDF417.enabled = true;
                    break;
                    case BarkoderConstants.DecoderType.PDF417Micro:
                    this.bkdView.config.getDecoderConfig().PDF417Micro.enabled = true;
                    break;
                    case BarkoderConstants.DecoderType.Datamatrix:
                    this.bkdView.config.getDecoderConfig().Datamatrix.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Code25:
                    this.bkdView.config.getDecoderConfig().Code25.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Interleaved25:
                    this.bkdView.config.getDecoderConfig().Interleaved25.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.ITF14:
                    this.bkdView.config.getDecoderConfig().ITF14.enabled = true;
                    break;
                    case BarkoderConstants.DecoderType.IATA25:
                    this.bkdView.config.getDecoderConfig().IATA25.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Matrix25:
                    this.bkdView.config.getDecoderConfig().Matrix25.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.Datalogic25:
                    this.bkdView.config.getDecoderConfig().Datalogic25.enabled = true;
                    break;
                case BarkoderConstants.DecoderType.COOP25:
                    this.bkdView.config.getDecoderConfig().COOP25.enabled = true;
                    break;
                    case BarkoderConstants.DecoderType.Dotcode:
                        this.bkdView.config.getDecoderConfig().Dotcode.enabled = true;
                        break;
                    default:
                        break;
            }
        });
      }

      setBarcodeTypeLengthRange(decoder: BarkoderConstants.DecoderType, minimumLength:number, maximumLength: number) {
        switch (decoder) {
            case BarkoderConstants.DecoderType.Aztec:
                this.bkdView.config.getDecoderConfig().Aztec.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Aztec.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.AztecCompact:
                this.bkdView.config.getDecoderConfig().AztecCompact.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().AztecCompact.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.QR:
                this.bkdView.config.getDecoderConfig().QR.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().QR.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.QRMicro:
                this.bkdView.config.getDecoderConfig().QRMicro.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().QRMicro.maximumLength = maximumLength
                break;
                case BarkoderConstants.DecoderType.Code128:
                    this.bkdView.config.getDecoderConfig().Code128.minimumLength = minimumLength
                    this.bkdView.config.getDecoderConfig().Code128.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Code93:
                this.bkdView.config.getDecoderConfig().Code93.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Code93.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Code39:
                this.bkdView.config.getDecoderConfig().Code39.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Code39.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Telepen:
                this.bkdView.config.getDecoderConfig().Telepen.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Telepen.maximumLength = maximumLength
                break;
                case BarkoderConstants.DecoderType.Code11:
                    this.bkdView.config.getDecoderConfig().Code11.minimumLength = minimumLength
                    this.bkdView.config.getDecoderConfig().Code11.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Msi:
                this.bkdView.config.getDecoderConfig().Msi.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Msi.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.UpcA:
                this.bkdView.config.getDecoderConfig().UpcA.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().UpcA.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.UpcE:
                this.bkdView.config.getDecoderConfig().UpcE.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().UpcE.maximumLength = maximumLength
                break;
                case BarkoderConstants.DecoderType.UpcE1:
                    this.bkdView.config.getDecoderConfig().UpcE1.minimumLength = minimumLength
                    this.bkdView.config.getDecoderConfig().UpcE1.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Ean13:
                this.bkdView.config.getDecoderConfig().Ean13.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Ean13.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Ean8:
                this.bkdView.config.getDecoderConfig().Ean8.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Ean8.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.PDF417:
                this.bkdView.config.getDecoderConfig().PDF417.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().PDF417.maximumLength = maximumLength
                break;
                case BarkoderConstants.DecoderType.PDF417Micro:
                    this.bkdView.config.getDecoderConfig().PDF417Micro.minimumLength = minimumLength
                    this.bkdView.config.getDecoderConfig().PDF417Micro.maximumLength = maximumLength
                break;
                case BarkoderConstants.DecoderType.Datamatrix:
                    this.bkdView.config.getDecoderConfig().Datamatrix.minimumLength = minimumLength
                    this.bkdView.config.getDecoderConfig().Datamatrix.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Code25:
                this.bkdView.config.getDecoderConfig().Code25.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Code25.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Interleaved25:
                this.bkdView.config.getDecoderConfig().Interleaved25.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Interleaved25.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.ITF14:
                this.bkdView.config.getDecoderConfig().ITF14.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().ITF14.maximumLength = maximumLength
                break;
                case BarkoderConstants.DecoderType.IATA25:
                    this.bkdView.config.getDecoderConfig().IATA25.minimumLength = minimumLength
                    this.bkdView.config.getDecoderConfig().IATA25.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Matrix25:
                this.bkdView.config.getDecoderConfig().Matrix25.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Matrix25.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.Datalogic25:
                this.bkdView.config.getDecoderConfig().Datalogic25.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().Datalogic25.maximumLength = maximumLength
                break;
            case BarkoderConstants.DecoderType.COOP25:
                this.bkdView.config.getDecoderConfig().COOP25.minimumLength = minimumLength
                this.bkdView.config.getDecoderConfig().COOP25.maximumLength = maximumLength
                break;
                case BarkoderConstants.DecoderType.Dotcode:
                    this.bkdView.config.getDecoderConfig().Dotcode.minimumLength = minimumLength
                    this.bkdView.config.getDecoderConfig().Dotcode.maximumLength = maximumLength
                    break;
                default:
                    break;
        }
    }

      getBarcodeTypeMaximumLenght(decoder: BarkoderConstants.DecoderType) : any {
        switch (decoder) {
            case BarkoderConstants.DecoderType.Aztec:
                return this.bkdView.config.getDecoderConfig().Aztec.maximumLength
            case BarkoderConstants.DecoderType.AztecCompact:
                return this.bkdView.config.getDecoderConfig().AztecCompact.maximumLength
            case BarkoderConstants.DecoderType.QR:
                return this.bkdView.config.getDecoderConfig().QR.maximumLength
            case BarkoderConstants.DecoderType.QRMicro:
                return this.bkdView.config.getDecoderConfig().QRMicro.maximumLength
            case BarkoderConstants.DecoderType.Code128:
                return   this.bkdView.config.getDecoderConfig().Code128.maximumLength
            case BarkoderConstants.DecoderType.Code93:
                return this.bkdView.config.getDecoderConfig().Code93.maximumLength
            case BarkoderConstants.DecoderType.Code39:
                return this.bkdView.config.getDecoderConfig().Code39.maximumLength
            case BarkoderConstants.DecoderType.Telepen:
                return this.bkdView.config.getDecoderConfig().Telepen.maximumLength
            case BarkoderConstants.DecoderType.Code11:
                return this.bkdView.config.getDecoderConfig().Code11.maximumLength
            case BarkoderConstants.DecoderType.Msi:
                return this.bkdView.config.getDecoderConfig().Msi.maximumLength
            case BarkoderConstants.DecoderType.UpcA:
                return this.bkdView.config.getDecoderConfig().UpcA.maximumLength
            case BarkoderConstants.DecoderType.UpcE:
                return this.bkdView.config.getDecoderConfig().UpcE.maximumLength
            case BarkoderConstants.DecoderType.UpcE1:
                return    this.bkdView.config.getDecoderConfig().UpcE1.maximumLength
            case BarkoderConstants.DecoderType.Ean13:
                return this.bkdView.config.getDecoderConfig().Ean13.maximumLength
            case BarkoderConstants.DecoderType.Ean8:
                return this.bkdView.config.getDecoderConfig().Ean8.maximumLength
            case BarkoderConstants.DecoderType.PDF417:
                return this.bkdView.config.getDecoderConfig().PDF417.maximumLength
            case BarkoderConstants.DecoderType.PDF417Micro:
                return this.bkdView.config.getDecoderConfig().PDF417Micro.maximumLength
            case BarkoderConstants.DecoderType.Datamatrix:
                return this.bkdView.config.getDecoderConfig().Datamatrix.maximumLength
            case BarkoderConstants.DecoderType.Code25:
                return this.bkdView.config.getDecoderConfig().Code25.maximumLength
            case BarkoderConstants.DecoderType.Interleaved25:
                return this.bkdView.config.getDecoderConfig().Interleaved25.maximumLength
            case BarkoderConstants.DecoderType.ITF14:
                return this.bkdView.config.getDecoderConfig().ITF14.maximumLength
            case BarkoderConstants.DecoderType.IATA25:
                return this.bkdView.config.getDecoderConfig().IATA25.maximumLength
            case BarkoderConstants.DecoderType.Matrix25:
                return this.bkdView.config.getDecoderConfig().Matrix25.maximumLength
            case BarkoderConstants.DecoderType.Datalogic25:
                return this.bkdView.config.getDecoderConfig().Datalogic25.maximumLength
            case BarkoderConstants.DecoderType.COOP25:
                return this.bkdView.config.getDecoderConfig().COOP25.maximumLength
            case BarkoderConstants.DecoderType.Dotcode:
                return this.bkdView.config.getDecoderConfig().Dotcode.maximumLength
        }
    }

    getBarcodeTypeMinimumLenght(decoder: BarkoderConstants.DecoderType) : any {
        switch (decoder) {
            case BarkoderConstants.DecoderType.Aztec:
                return this.bkdView.config.getDecoderConfig().Aztec.minimumLength
            case BarkoderConstants.DecoderType.AztecCompact:
                return this.bkdView.config.getDecoderConfig().AztecCompact.minimumLength
            case BarkoderConstants.DecoderType.QR:
                return this.bkdView.config.getDecoderConfig().QR.minimumLength
            case BarkoderConstants.DecoderType.QRMicro:
                return this.bkdView.config.getDecoderConfig().QRMicro.minimumLength
            case BarkoderConstants.DecoderType.Code128:
                return   this.bkdView.config.getDecoderConfig().Code128.minimumLength
            case BarkoderConstants.DecoderType.Code93:
                return this.bkdView.config.getDecoderConfig().Code93.minimumLength
            case BarkoderConstants.DecoderType.Code39:
                return this.bkdView.config.getDecoderConfig().Code39.minimumLength
            case BarkoderConstants.DecoderType.Telepen:
                return this.bkdView.config.getDecoderConfig().Telepen.minimumLength
            case BarkoderConstants.DecoderType.Code11:
                return this.bkdView.config.getDecoderConfig().Code11.minimumLength
            case BarkoderConstants.DecoderType.Msi:
                return this.bkdView.config.getDecoderConfig().Msi.minimumLength
            case BarkoderConstants.DecoderType.UpcA:
                return this.bkdView.config.getDecoderConfig().UpcA.minimumLength
            case BarkoderConstants.DecoderType.UpcE:
                return this.bkdView.config.getDecoderConfig().UpcE.minimumLength
            case BarkoderConstants.DecoderType.UpcE1:
                return    this.bkdView.config.getDecoderConfig().UpcE1.minimumLength
            case BarkoderConstants.DecoderType.Ean13:
                return this.bkdView.config.getDecoderConfig().Ean13.minimumLength
            case BarkoderConstants.DecoderType.Ean8:
                return this.bkdView.config.getDecoderConfig().Ean8.minimumLength
            case BarkoderConstants.DecoderType.PDF417:
                return this.bkdView.config.getDecoderConfig().PDF417.minimumLength
            case BarkoderConstants.DecoderType.PDF417Micro:
                return this.bkdView.config.getDecoderConfig().PDF417Micro.minimumLength
            case BarkoderConstants.DecoderType.Datamatrix:
                return this.bkdView.config.getDecoderConfig().Datamatrix.minimumLength
            case BarkoderConstants.DecoderType.Code25:
                return this.bkdView.config.getDecoderConfig().Code25.minimumLength
            case BarkoderConstants.DecoderType.Interleaved25:
                return this.bkdView.config.getDecoderConfig().Interleaved25.minimumLength
            case BarkoderConstants.DecoderType.ITF14:
                return this.bkdView.config.getDecoderConfig().ITF14.minimumLength
            case BarkoderConstants.DecoderType.IATA25:
                return this.bkdView.config.getDecoderConfig().IATA25.minimumLength
            case BarkoderConstants.DecoderType.Matrix25:
                return this.bkdView.config.getDecoderConfig().Matrix25.minimumLength
            case BarkoderConstants.DecoderType.Datalogic25:
                return this.bkdView.config.getDecoderConfig().Datalogic25.minimumLength
            case BarkoderConstants.DecoderType.COOP25:
                return this.bkdView.config.getDecoderConfig().COOP25.minimumLength
            case BarkoderConstants.DecoderType.Dotcode:
                return this.bkdView.config.getDecoderConfig().Dotcode.minimumLength
        }
    }

    setMaximumResultsCount(maximumResultsCount : number): void {
        this.bkdView.config.getDecoderConfig().maximumResultsCount = maximumResultsCount
    }

    setDuplicatesDelayMs(duplicateDelayMs : number) : void {
        this.bkdView.config.getDecoderConfig().duplicatesDelayMs = duplicateDelayMs
    }

    setMulticodeCachingDuration(multicodeCachingDuration : number) : void {
        this.bkdConfig.SetMulticodeCachingDuration(multicodeCachingDuration)
    }

    setMulticodeCachingEnabled(multiCodeCachingEnabled : boolean) : void {
        this.bkdConfig.SetMulticodeCachingEnabled(multiCodeCachingEnabled)
    }

    getMaximumResultsCount() : any {
        return this.bkdView.config.getDecoderConfig().maximumResultsCount
    }
    
    getDuplicatesDelayMs() : any {
       return this.bkdView.config.getDecoderConfig().duplicatesDelayMs
    }

    setDatamatrixDpmModeEnabled(dpmModeEnabled : boolean) : void {
        this.bkdView.config.getDecoderConfig().Datamatrix.dpmMode = dpmModeEnabled
    }

    setUpcEanDeblurEnabled(enabled : boolean) : void {
        this.bkdView.config.getDecoderConfig().upcEanDeblur = enabled
    }

    setEnableMisshaped1DEnabled(enabled : boolean) : void {
        this.bkdView.config.getDecoderConfig().enableMisshaped1D = enabled
    }

    setBarcodeThumbnailOnResultEnabled(enabled : boolean) : void{
        this.bkdView.config.setThumbnailOnResultEnabled(enabled)
       }
    
    isBarcodeThumbnailOnResultEnabled() : any{
        return this.bkdView.config.getThumbnailOnResulEnabled()
       }

    setThresholdBetweenDuplicatesScans(thresholdBetweenDuplicatesScans : number) : void {
        this.bkdView.config.setThresholdBetweenDuplicatesScans(thresholdBetweenDuplicatesScans)
    }

    getThresholdBetweenDuplicatesScans() : Promise <any> {
        return this.bkdView.config.getThresholdBetweenDuplicatesScans()
    }

    getMulticodeCachingEnabled() : any {
        return this.bkdConfig.IsMulticodeCachingEnabled()
    }
    
    getMulticodeCachingDuration() : any {
        return this.bkdConfig.GetMulticodeCachingDuration()
       }
    
    isUpcEanDeblurEnabled() : any {
        return this.bkdView.config.getDecoderConfig().upcEanDeblur
    }
    
    isMisshaped1DEnabled() : any { 
        return this.bkdView.config.getDecoderConfig().enableMisshaped1D
    }

    isVINRestrictionsEnabled() : any {
        return this.bkdView.config.getDecoderConfig().enableVINRestrictions
    }

    setEnableVINRestrictions(vinRestrictionsEnabled: boolean) : void {
        this.bkdView.config.getDecoderConfig().enableVINRestrictions = vinRestrictionsEnabled
    }

    setLicenseKey(licenseKey: string): void {
        this.bkdView.config = new com.barkoder.BarkoderConfig(context, licenseKey, null);
      }
      
      configureBarkoder(config: BarkoderConstants.BarkoderConfig): void {
        const BarkoderHelper = com.barkoder.BarkoderHelper;
        const JSONObject = org.json.JSONObject;

        try {
            const jsonString = config.toJsonString();

            const javaJSONObject = new JSONObject(jsonString);

            BarkoderHelper.applyJsonToConfig(this.bkdView.config, javaJSONObject);
        } catch (e) {
            console.error("Error applying JSON to BarkoderConfig:", e);
        }
    }

      private hexToAndroidColor(hexColor: string): number {
        hexColor = hexColor.replace("#", "");
        const red = parseInt(hexColor.substring(0, 2), 16);
        const green = parseInt(hexColor.substring(2, 4), 16);
        const blue = parseInt(hexColor.substring(4, 6), 16);
        const androidColor = android.graphics.Color.rgb(red, green, blue);
    
        return androidColor;
    }

    getPropertiesAndMethods(obj: any): void {
        const propertiesAndMethods: string[] = [];
        
        for (let key in obj) {
            console.log(`Key: ${key}, Value: ${obj[key]}`);
        }
    }
   
}

