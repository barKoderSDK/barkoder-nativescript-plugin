import { BarkoderConstants } from "./barkoder-nativescript.common";
import * as application from "@nativescript/core/application";
import { View } from "@nativescript/core";
import { BarkoderView } from "./barkoder-nativescript.common";
import { ImageSource } from '@nativescript/core';



const androidSupport =
  global.androidx && global.androidx.appcompat
    ? global.androidx.core.app
    : android.support.v4.app;
declare const com, global: any;

const context = application.android.context;
const Manifest = android.Manifest;

export class BarkoderViewAndroid extends View {
  public bkdView: any;
  public bkd: any;
  public bkdConfig: any;
  public bkdHelper: any;

  constructor() {
    super();
    this.bkdConfig = com.barkoder.BarkoderConfig;
    this.bkd = new com.barkoder.Barkoder();
    this.bkdView = new com.barkoder.BarkoderView(context, true);
    this.bkdView.config = new com.barkoder.BarkoderConfig(
      context,
      "LICENSE_KEY",
      null
    );
    this.bkdHelper = new com.barkoder.BarkoderHelper();
    this.nativeView = this.bkdView;
  }

  /**
   * Initiates the barcode scanning process, allowing the application to detect and decode barcodes from the device's camera feed
   */
  startScanning(
    BarkoderResultCallback: BarkoderConstants.BarkoderResultCallback
  ): void {
    const resultCallback = new com.barkoder.interfaces.BarkoderResultCallback({
      scanningFinished: (
        results: any[],
        thumbnails: any[],
        resultImage: any
      ) => {
        BarkoderResultCallback.scanningFinished(
          results,
          thumbnails,
          resultImage
        );
      },
    });
    this.bkdView.startScanning(resultCallback);
  }


  scanImage(
    base64Image: string,
    BarkoderResultCallback: BarkoderConstants.BarkoderResultCallback
  ): void {
    const BarkoderHelper = com.barkoder.BarkoderHelper;

    // Convert base64 string to bitmap
    const bitmap = ImageSource.fromBase64Sync(base64Image).android;

    // Create an instance of BarkoderResultCallback
    const resultCallback = new com.barkoder.interfaces.BarkoderResultCallback({
      scanningFinished: (
        results: any[],
        thumbnails: any[],
        resultImage: any
      ) => {
        BarkoderResultCallback.scanningFinished(
          results,
          thumbnails,
          resultImage
        );
      },
    });

    // Pass the result callback correctly to scanImage
    BarkoderHelper.scanImage(bitmap, this.bkdView.config, resultCallback, context);
  }

  /**
   * Halts the barcode scanning process, stopping the camera from capturing and processing barcode information
   */
  stopScanning(): void {
    this.bkdView.stopScanning();
  }

  pauseScanning(): void {
    this.bkdView.pauseScanning();
  }

  /**
   * Checks whether the device has a built-in flash (torch) that can be used for illumination during barcode scanning
   */
  isFlashAvailable(callback: BarkoderConstants.FlashAvailableCallback) {
    const isFlashAvailableCallback = new com.barkoder.interfaces.FlashAvailableCallback(
      {
        onFlashAvailable: (isFlashAvailable: any) => {
          callback.onFlashAvailable(isFlashAvailable);
        },
      }
    );
    this.bkdView.isFlashAvailable(isFlashAvailableCallback);
  }

  /**
   * Enables or disables the device's flash (torch) for illumination during barcode scanning
   * @param enabled
   */
  setFlashEnabled(enabled: boolean): void {
    this.bkdView.setFlashEnabled(enabled);
  }

  /**
   * Retrieves the maximum available zoom factor for the device's camera
   */
  getMaxZoomFactor(callback: BarkoderConstants.MaxZoomAvailableCallback) {
    const MaxZoomCallback = new com.barkoder.interfaces.MaxZoomAvailableCallback(
      {
        onMaxZoomAvailable: (maxZoomFacttor: any) => {
          callback.onMaxZoomAvailable(maxZoomFacttor);
        },
      }
    );
    this.bkdView.getMaxZoomFactor(MaxZoomCallback);
  }

  /**
   * Sets the zoom factor for the device's camera, adjusting the level of zoom during barcode scanning
   * @param zoomFactor
   */
  setZoomFactor(zoomFactor: number): void {
    this.bkdView.setZoomFactor(zoomFactor);
  }

  /**
   * Retrieves the hexadecimal color code representing the line color used to indicate the location of detected barcodes
   */
  getLocationLineColorHex(): any {
    return this.bkdView.config.getLocationLineColor();
  }

  /**
   * Sets the color of the lines used to indicate the location of detected barcodes on the camera feed
   */
  setLocationLineColor(locationLineColor: string): void {
    const locationColor = this.hexToAndroidColor(locationLineColor);
    this.bkdView.config.setLocationLineColor(locationColor);
  }


  setIdDocumentMasterChecksumEnabled(enabled: boolean): void {
    if(enabled){
      this.bkdView.config.getDecoderConfig().IDDocument.masterChecksumType = com.barkoder.Barkoder.StandardChecksumType.Enabled
    } else {
      this.bkdView.config.getDecoderConfig().IDDocument.masterChecksumType = com.barkoder.Barkoder.StandardChecksumType.Disabled
    }
  }

  isIdDocumentMasterChecksumEnabled(): boolean {
    return this.bkdView.config.getDecoderConfig().IDDocument.masterChecksumType === com.barkoder.Barkoder.StandardChecksumType.Enabled;
  }

  /**
   * Sets the color of the lines outlining the Region of Interest (ROI) for barcode scanning on the camera feed
   */
  setRoiLineColor(roiLineColor: string): void {
    const roiLineColorHex = this.hexToAndroidColor(roiLineColor);
    this.bkdView.config.setRoiLineColor(roiLineColorHex);
  }

  /**
   * Sets the width of the lines outlining the Region of Interest (ROI) for barcode scanning on the camera feed
   */
  setRoiLineWidth(roiLineWidth: number): void {
    this.bkdView.config.setRoiLineWidth(roiLineWidth);
  }

  /**
   * Sets the background color of the overlay within the Region of Interest (ROI) for barcode scanning on the camera feed
   */
  setRoiOverlayBackgroundColor(roiOverlayBackgroundColor): void {
    const roiOberlayBackgroundColor = this.hexToAndroidColor(
      roiOverlayBackgroundColor
    );
    this.bkdView.config.setRoiOverlayBackgroundColor(roiOberlayBackgroundColor);
  }

  /**
   * Enables or disables the automatic closing of the scanning session upon detecting a barcode result
   */
  setCloseSessionOnResultEnabled(enabled: boolean): void {
    this.bkdView.config.setCloseSessionOnResultEnabled(enabled);
  }

  /**
   * Enables or disables the capturing and processing of image data when a barcode is successfully detected
   */
  setImageResultEnabled(enabled: boolean): void {
    this.bkdView.config.setImageResultEnabled(enabled);
  }

  /**
   * Enables or disables the inclusion of barcode location information within the image data result
   */
  setLocationInImageResultEnabled(enabled: boolean): void {
    this.bkdView.config.setLocationInImageResultEnabled(enabled);
  }

  /**
   * Enables or disables the display of barcode location information on the camera preview
   */
  setLocationInPreviewEnabled(enabled: boolean): void {
    this.bkdView.config.setLocationInPreviewEnabled(enabled);
  }

  /**
   * Enables or disables the pinch-to-zoom feature for adjusting the zoom level during barcode scanning
   */
  setPinchToZoomEnabled(enabled: boolean): void {
    this.bkdView.config.setPinchToZoomEnabled(enabled);
  }

  /**
   * Sets the visibility of the Region of Interest (ROI) on the camera preview
   */
  setRegionOfInterestVisible(enabled: boolean): void {
    this.bkdView.config.setRegionOfInterestVisible(enabled);
  }

  /**
   * Defines the Region of Interest (ROI) on the camera preview for barcode scanning, specifying an area where the application focuses on detecting barcodes
   */
  setRegionOfInterest(
    left: number,
    top: number,
    width: number,
    height: number
  ): void {
    this.bkdView.config.setRegionOfInterest(left, top, width, height);
  }

  /**
   * Enables or disables the audible beep sound upon successfully decoding a barcode
   */
  setBeepOnSuccessEnabled(enabled: boolean): void {
    this.bkdView.config.setBeepOnSuccessEnabled(enabled);
  }

  /**
   * Enables or disables the device vibration upon successfully decoding a barcode.
   */
  setVibrateOnSuccessEnabled(enabled: boolean): void {
    this.bkdView.config.setVibrateOnSuccessEnabled(enabled);
  }

  /**
   * Retrieves the character set used for encoding barcode data
   */
  getEncodingCharacterSet(): any {
    return this.bkdView.config.getDecoderConfig().encodingCharacterSet;
  }

  /**
   * Retrieves the current decoding speed setting for barcode scanning
   */
  getDecodingSpeed(): any {
    return this.bkdView.config.getDecoderConfig().decodingSpeed;
  }

  /**
   * Retrieves the formatting type used for presenting decoded barcode data
   */
  getFormattingType(): any {
    return this.bkdView.config.getDecoderConfig().formattingType;
  }

  /**
   * Sets the width of the lines indicating the location of detected barcodes on the camera feed
   */
  setLocationLineWidth(width: number): void {
    const roundedValue = Math.round(width * 100) / 100;
    this.bkdView.config.setLocationLineWidth(roundedValue);
  }

  /**
   * Retrieves the current width setting for the lines indicating the location of detected barcodes on the camera feed
   */
  getLocationLineWidth(): any {
    return this.bkdView.config.getLocationLineWidth();
  }

  /**
   * Retrieves the current width setting for the lines outlining the Region of Interest (ROI) on the camera preview
   */
  getRoiLineWidth(): any {
    return this.bkdView.config.getRoiLineWidth();
  }

  /**
   * Retrieves the hexadecimal color code representing the background color of the overlay within the Region of Interest (ROI) on the camera preview
   */
  getRoiOverlayBackgroundColorHex(): any {
    return this.bkdView.config.getRoiOverlayBackgroundColor();
  }

  /**
   * Enables or disables the automatic closing of the scanning session upon detecting a barcode result
   */
  isCloseSessionOnResultEnabled(): any {
    return this.bkdView.config.isCloseSessionOnResultEnabled();
  }

  /**
   * Enables or disables the capturing and processing of image data when a barcode is successfully detected
   */
  isImageResultEnabled(): any {
    return this.bkdView.config.isImageResultEnabled();
  }

  /**
   * Enables or disables the inclusion of barcode location information within the image data result
   */
  isLocationInImageResultEnabled(): any {
    return this.bkdView.config.isLocationInImageResultEnabled();
  }

  /**
   * Retrieves the region of interest (ROI)
   */
  getRegionOfInterest(): any {
    return this.bkdView.config.getRegionOfInterest();
  }

  /**
   * Retrieves the threads limit
   */
  getThreadsLimit(): any {
    return this.bkdConfig.GetThreadsLimit();
  }

  /**
   * Sets the threads limit
   */
  setThreadsLimit(threadsLimit: number): void {
    this.bkdConfig.SetThreadsLimit(threadsLimit);
  }

  /**
   * Checks if location in preview is enabled
   */
  isLocationInPreviewEnabled(): Promise<any> {
    return this.bkdView.config.isLocationInPreviewEnabled();
  }

  /**
   * Checks if pinch to zoom is enabled
   */
  isPinchToZoomEnabled(): Promise<any> {
    return this.bkdView.config.isPinchToZoomEnabled();
  }

  /**
   * Checks if the region of interest (ROI) is visible
   */
  isRegionOfInterestVisible(): Promise<any> {
    return this.bkdView.config.isRegionOfInterestVisible();
  }

  /**
   * Retrieves the value indicating whether a beep sound is played on successful barcode scanning
   */
  isBeepOnSuccessEnabled(): Promise<any> {
    return this.bkdView.config.isBeepOnSuccessEnabled();
  }

  /**
   * Retrieves the value indicating whether vibration is enabled on successful barcode scanning
   */
  isVibrateOnSuccessEnabled(): Promise<any> {
    return this.bkdView.config.isVibrateOnSuccessEnabled();
  }

  /**
   * Retrieves the version of the Barkoder library
   */
  getVersion(): any {
    return com.barkoder.Barkoder.GetVersion();
  }

  /**
   * Retrieves the MSI checksum type
   */
  getMsiCheckSumType(): any {
    return this.bkdView.config.getDecoderConfig().Msi.checksumType;
  }

  /**
   * Retrieves the checksum type for Code 39 barcodes
   */
  getCode39CheckSumType(): any {
    return this.bkdView.config.getDecoderConfig().Code39.checksumType;
  }

  /**
   * Retrieves the Code11 checksum type
   */
  getCode11CheckSumType(): any {
    return this.bkdView.config.getDecoderConfig().Code11.checksumType;
  }

  /**
   * Sets the resolution for barcode scanning
    */
  setBarkoderResolution(
    barkoderResolution: BarkoderConstants.BarkoderResolution
  ): void {
    if (barkoderResolution == BarkoderConstants.BarkoderResolution.NORMAL) {
      this.bkdView.config.setBarkoderResolution(
        com.barkoder.enums.BarkoderResolution.Normal
      );
    } else if (
      barkoderResolution == BarkoderConstants.BarkoderResolution.HIGH
    ) {
      this.bkdView.config.setBarkoderResolution(
        com.barkoder.enums.BarkoderResolution.HIGH
      );
    }
  }

  /**
   * Retrieves the resolution for barcode scanning
   */
  getBarkoderResolution(): any {
    return this.bkdView.config.getBarkoderResolution();
  }

  /**
   * Sets the encoding character set for barcode scanning
   */
  setEncodingCharacterSet(encodingCharSet: any): void {
    this.bkdView.config.getDecoderConfig().encodingCharacterSet = encodingCharSet;
  }

  /**
   * Sets the decoding speed for barcode scanning
   */
  setDecodingSpeed(decodingSpeed: BarkoderConstants.DecodingSpeed): void {
    if (decodingSpeed == BarkoderConstants.DecodingSpeed.Slow) {
      this.bkdView.config.getDecoderConfig().decodingSpeed =
        com.barkoder.Barkoder.DecodingSpeed.Slow;
    } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Fast) {
      this.bkdView.config.getDecoderConfig().decodingSpeed =
        com.barkoder.Barkoder.DecodingSpeed.Fast;
    } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Normal) {
      this.bkdView.config.getDecoderConfig().decodingSpeed =
        com.barkoder.Barkoder.DecodingSpeed.Normal;
    } else {
      console.log("Not avilbilable Decoding Speed");
    }
  }

  /**
   * Sets the formatting type for barcode scanning
   */
  setFormattingType(formattingType: BarkoderConstants.FormattingType) {
    switch (formattingType) {
      case BarkoderConstants.FormattingType.Disabled:
        this.bkdView.config.getDecoderConfig().formattingType =
          com.barkoder.Barkoder.FormattingType.Disabled;
        break;
      case BarkoderConstants.FormattingType.Automatic:
        this.bkdView.config.getDecoderConfig().formattingType =
          com.barkoder.Barkoder.FormattingType.Automatic;
        break;
      case BarkoderConstants.FormattingType.GS1:
        this.bkdView.config.getDecoderConfig().formattingType =
          com.barkoder.Barkoder.FormattingType.GS1;
        break;
      case BarkoderConstants.FormattingType.AAMVA:
        this.bkdView.config.getDecoderConfig().formattingType =
          com.barkoder.Barkoder.FormattingType.AAMVA;
        break;
    }
  }

  /**
   * Sets the MSI checksum type
   */
  setMsiCheckSumType(msiCheckSumType: BarkoderConstants.MsiChecksumType) {
    switch (msiCheckSumType) {
      case BarkoderConstants.MsiChecksumType.Disabled:
        this.bkdView.config.getDecoderConfig().Msi.checksumType =
          com.barkoder.Barkoder.MsiChecksumType.Disabled;
        break;
      case BarkoderConstants.MsiChecksumType.Mod10:
        this.bkdView.config.getDecoderConfig().Msi.checksumType =
          com.barkoder.Barkoder.MsiChecksumType.Mod10;
        break;
      case BarkoderConstants.MsiChecksumType.Mod11:
        this.bkdView.config.getDecoderConfig().Msi.checksumType =
          com.barkoder.Barkoder.MsiChecksumType.Mod11;
        break;
      case BarkoderConstants.MsiChecksumType.Mod1010:
        this.bkdView.config.getDecoderConfig().Msi.checksumType =
          com.barkoder.Barkoder.MsiChecksumType.Mod1010;
        break;
      case BarkoderConstants.MsiChecksumType.Mod1110:
        this.bkdView.config.getDecoderConfig().Msi.checksumType =
          com.barkoder.Barkoder.MsiChecksumType.Mod1110;
        break;
      case BarkoderConstants.MsiChecksumType.Mod11IBM:
        this.bkdView.config.getDecoderConfig().Msi.checksumType =
          com.barkoder.Barkoder.MsiChecksumType.Mod11IBM;
        break;
      case BarkoderConstants.MsiChecksumType.Mod1110IBM:
        this.bkdView.config.getDecoderConfig().Msi.checksumType =
          com.barkoder.Barkoder.MsiChecksumType.Mod1110IBM;
        break;
    }
  }

  /**
   * Sets the Code39 checksum type
   */
  setCode39CheckSumType(
    code39ChecksumType: BarkoderConstants.Code39ChecksumType
  ) {
    switch (code39ChecksumType) {
      case BarkoderConstants.Code39ChecksumType.Disabled:
        this.bkdView.config.getDecoderConfig().Code39.checksumType =
          com.barkoder.Barkoder.Code39ChecksumType.Disabled;
        break;
      case BarkoderConstants.Code39ChecksumType.Enabled:
        this.bkdView.config.getDecoderConfig().Code39.checksumType =
          com.barkoder.Barkoder.Code39ChecksumType.Enabled;
        break;
    }
  }

  /**
   * Sets the Code11 checksum type
   */
  setCode11CheckSumType(
    code11CheckSumType: BarkoderConstants.Code11ChecksumType
  ) {
    switch (code11CheckSumType) {
      case BarkoderConstants.Code11ChecksumType.Disabled:
        this.bkdView.config.getDecoderConfig().Code11.checksumType =
          com.barkoder.Barkoder.Code11ChecksumType.Disabled;
        break;
      case BarkoderConstants.Code11ChecksumType.Single:
        this.bkdView.config.getDecoderConfig().Code11.checksumType =
          com.barkoder.Barkoder.Code11ChecksumType.Single;
        break;
      case BarkoderConstants.Code11ChecksumType.Double:
        this.bkdView.config.getDecoderConfig().Code11.checksumType =
          com.barkoder.Barkoder.Code11ChecksumType.Double;
        break;
    }
  }

  /**
   * Checks if a specific barcode type is enabled
   */
  isBarcodeTypeEnabled(decoder: BarkoderConstants.DecoderType): boolean {
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
      case BarkoderConstants.DecoderType.IDDocument:
        return this.bkdView.config.getDecoderConfig().IDDocument.enabled;
    }
  }

  /**
   * Sets whether a specific barcode type is enabled
   */
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
    this.bkdView.config.getDecoderConfig().IDDocument.enabled = false;
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
        case BarkoderConstants.DecoderType.IDDocument:
          this.bkdView.config.getDecoderConfig().IDDocument.enabled = true;
          break;
        default:
          break;
      }
    });
  }

  /**
   * Sets the length range for the specified barcode type
   */
  setBarcodeTypeLengthRange(
    decoder: BarkoderConstants.DecoderType,
    minimumLength: number,
    maximumLength: number
  ) {
    switch (decoder) {
      case BarkoderConstants.DecoderType.Aztec:
        this.bkdView.config.getDecoderConfig().Aztec.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Aztec.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.AztecCompact:
        this.bkdView.config.getDecoderConfig().AztecCompact.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().AztecCompact.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.QR:
        this.bkdView.config.getDecoderConfig().QR.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().QR.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.QRMicro:
        this.bkdView.config.getDecoderConfig().QRMicro.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().QRMicro.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Code128:
        this.bkdView.config.getDecoderConfig().Code128.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Code128.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Code93:
        this.bkdView.config.getDecoderConfig().Code93.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Code93.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Code39:
        this.bkdView.config.getDecoderConfig().Code39.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Code39.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Telepen:
        this.bkdView.config.getDecoderConfig().Telepen.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Telepen.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Code11:
        this.bkdView.config.getDecoderConfig().Code11.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Code11.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Msi:
        this.bkdView.config.getDecoderConfig().Msi.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Msi.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.UpcA:
        this.bkdView.config.getDecoderConfig().UpcA.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().UpcA.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.UpcE:
        this.bkdView.config.getDecoderConfig().UpcE.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().UpcE.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.UpcE1:
        this.bkdView.config.getDecoderConfig().UpcE1.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().UpcE1.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Ean13:
        this.bkdView.config.getDecoderConfig().Ean13.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Ean13.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Ean8:
        this.bkdView.config.getDecoderConfig().Ean8.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Ean8.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.PDF417:
        this.bkdView.config.getDecoderConfig().PDF417.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().PDF417.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.PDF417Micro:
        this.bkdView.config.getDecoderConfig().PDF417Micro.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().PDF417Micro.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Datamatrix:
        this.bkdView.config.getDecoderConfig().Datamatrix.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Datamatrix.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Code25:
        this.bkdView.config.getDecoderConfig().Code25.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Code25.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Interleaved25:
        this.bkdView.config.getDecoderConfig().Interleaved25.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Interleaved25.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.ITF14:
        this.bkdView.config.getDecoderConfig().ITF14.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().ITF14.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.IATA25:
        this.bkdView.config.getDecoderConfig().IATA25.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().IATA25.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Matrix25:
        this.bkdView.config.getDecoderConfig().Matrix25.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Matrix25.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Datalogic25:
        this.bkdView.config.getDecoderConfig().Datalogic25.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Datalogic25.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.COOP25:
        this.bkdView.config.getDecoderConfig().COOP25.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().COOP25.maximumLength = maximumLength;
        break;
      case BarkoderConstants.DecoderType.Dotcode:
        this.bkdView.config.getDecoderConfig().Dotcode.minimumLength = minimumLength;
        this.bkdView.config.getDecoderConfig().Dotcode.maximumLength = maximumLength;
        break;
      default:
        break;
    }
  }

  getBarcodeTypeMaximumLenght(decoder: BarkoderConstants.DecoderType): any {
    switch (decoder) {
      case BarkoderConstants.DecoderType.Aztec:
        return this.bkdView.config.getDecoderConfig().Aztec.maximumLength;
      case BarkoderConstants.DecoderType.AztecCompact:
        return this.bkdView.config.getDecoderConfig().AztecCompact
          .maximumLength;
      case BarkoderConstants.DecoderType.QR:
        return this.bkdView.config.getDecoderConfig().QR.maximumLength;
      case BarkoderConstants.DecoderType.QRMicro:
        return this.bkdView.config.getDecoderConfig().QRMicro.maximumLength;
      case BarkoderConstants.DecoderType.Code128:
        return this.bkdView.config.getDecoderConfig().Code128.maximumLength;
      case BarkoderConstants.DecoderType.Code93:
        return this.bkdView.config.getDecoderConfig().Code93.maximumLength;
      case BarkoderConstants.DecoderType.Code39:
        return this.bkdView.config.getDecoderConfig().Code39.maximumLength;
      case BarkoderConstants.DecoderType.Telepen:
        return this.bkdView.config.getDecoderConfig().Telepen.maximumLength;
      case BarkoderConstants.DecoderType.Code11:
        return this.bkdView.config.getDecoderConfig().Code11.maximumLength;
      case BarkoderConstants.DecoderType.Msi:
        return this.bkdView.config.getDecoderConfig().Msi.maximumLength;
      case BarkoderConstants.DecoderType.UpcA:
        return this.bkdView.config.getDecoderConfig().UpcA.maximumLength;
      case BarkoderConstants.DecoderType.UpcE:
        return this.bkdView.config.getDecoderConfig().UpcE.maximumLength;
      case BarkoderConstants.DecoderType.UpcE1:
        return this.bkdView.config.getDecoderConfig().UpcE1.maximumLength;
      case BarkoderConstants.DecoderType.Ean13:
        return this.bkdView.config.getDecoderConfig().Ean13.maximumLength;
      case BarkoderConstants.DecoderType.Ean8:
        return this.bkdView.config.getDecoderConfig().Ean8.maximumLength;
      case BarkoderConstants.DecoderType.PDF417:
        return this.bkdView.config.getDecoderConfig().PDF417.maximumLength;
      case BarkoderConstants.DecoderType.PDF417Micro:
        return this.bkdView.config.getDecoderConfig().PDF417Micro.maximumLength;
      case BarkoderConstants.DecoderType.Datamatrix:
        return this.bkdView.config.getDecoderConfig().Datamatrix.maximumLength;
      case BarkoderConstants.DecoderType.Code25:
        return this.bkdView.config.getDecoderConfig().Code25.maximumLength;
      case BarkoderConstants.DecoderType.Interleaved25:
        return this.bkdView.config.getDecoderConfig().Interleaved25
          .maximumLength;
      case BarkoderConstants.DecoderType.ITF14:
        return this.bkdView.config.getDecoderConfig().ITF14.maximumLength;
      case BarkoderConstants.DecoderType.IATA25:
        return this.bkdView.config.getDecoderConfig().IATA25.maximumLength;
      case BarkoderConstants.DecoderType.Matrix25:
        return this.bkdView.config.getDecoderConfig().Matrix25.maximumLength;
      case BarkoderConstants.DecoderType.Datalogic25:
        return this.bkdView.config.getDecoderConfig().Datalogic25.maximumLength;
      case BarkoderConstants.DecoderType.COOP25:
        return this.bkdView.config.getDecoderConfig().COOP25.maximumLength;
      case BarkoderConstants.DecoderType.Dotcode:
        return this.bkdView.config.getDecoderConfig().Dotcode.maximumLength;
    }
  }

  getBarcodeTypeMinimumLenght(decoder: BarkoderConstants.DecoderType): any {
    switch (decoder) {
      case BarkoderConstants.DecoderType.Aztec:
        return this.bkdView.config.getDecoderConfig().Aztec.minimumLength;
      case BarkoderConstants.DecoderType.AztecCompact:
        return this.bkdView.config.getDecoderConfig().AztecCompact
          .minimumLength;
      case BarkoderConstants.DecoderType.QR:
        return this.bkdView.config.getDecoderConfig().QR.minimumLength;
      case BarkoderConstants.DecoderType.QRMicro:
        return this.bkdView.config.getDecoderConfig().QRMicro.minimumLength;
      case BarkoderConstants.DecoderType.Code128:
        return this.bkdView.config.getDecoderConfig().Code128.minimumLength;
      case BarkoderConstants.DecoderType.Code93:
        return this.bkdView.config.getDecoderConfig().Code93.minimumLength;
      case BarkoderConstants.DecoderType.Code39:
        return this.bkdView.config.getDecoderConfig().Code39.minimumLength;
      case BarkoderConstants.DecoderType.Telepen:
        return this.bkdView.config.getDecoderConfig().Telepen.minimumLength;
      case BarkoderConstants.DecoderType.Code11:
        return this.bkdView.config.getDecoderConfig().Code11.minimumLength;
      case BarkoderConstants.DecoderType.Msi:
        return this.bkdView.config.getDecoderConfig().Msi.minimumLength;
      case BarkoderConstants.DecoderType.UpcA:
        return this.bkdView.config.getDecoderConfig().UpcA.minimumLength;
      case BarkoderConstants.DecoderType.UpcE:
        return this.bkdView.config.getDecoderConfig().UpcE.minimumLength;
      case BarkoderConstants.DecoderType.UpcE1:
        return this.bkdView.config.getDecoderConfig().UpcE1.minimumLength;
      case BarkoderConstants.DecoderType.Ean13:
        return this.bkdView.config.getDecoderConfig().Ean13.minimumLength;
      case BarkoderConstants.DecoderType.Ean8:
        return this.bkdView.config.getDecoderConfig().Ean8.minimumLength;
      case BarkoderConstants.DecoderType.PDF417:
        return this.bkdView.config.getDecoderConfig().PDF417.minimumLength;
      case BarkoderConstants.DecoderType.PDF417Micro:
        return this.bkdView.config.getDecoderConfig().PDF417Micro.minimumLength;
      case BarkoderConstants.DecoderType.Datamatrix:
        return this.bkdView.config.getDecoderConfig().Datamatrix.minimumLength;
      case BarkoderConstants.DecoderType.Code25:
        return this.bkdView.config.getDecoderConfig().Code25.minimumLength;
      case BarkoderConstants.DecoderType.Interleaved25:
        return this.bkdView.config.getDecoderConfig().Interleaved25
          .minimumLength;
      case BarkoderConstants.DecoderType.ITF14:
        return this.bkdView.config.getDecoderConfig().ITF14.minimumLength;
      case BarkoderConstants.DecoderType.IATA25:
        return this.bkdView.config.getDecoderConfig().IATA25.minimumLength;
      case BarkoderConstants.DecoderType.Matrix25:
        return this.bkdView.config.getDecoderConfig().Matrix25.minimumLength;
      case BarkoderConstants.DecoderType.Datalogic25:
        return this.bkdView.config.getDecoderConfig().Datalogic25.minimumLength;
      case BarkoderConstants.DecoderType.COOP25:
        return this.bkdView.config.getDecoderConfig().COOP25.minimumLength;
      case BarkoderConstants.DecoderType.Dotcode:
        return this.bkdView.config.getDecoderConfig().Dotcode.minimumLength;
    }
  }

  /**
   * Sets the maximum number of results to be returned from barcode scanning
   */
  setMaximumResultsCount(maximumResultsCount: number): void {
    this.bkdView.config.getDecoderConfig().maximumResultsCount = maximumResultsCount;
  }

  /**
   * Sets the delay in milliseconds for considering duplicate barcodes during scanning
   */
  setDuplicatesDelayMs(duplicateDelayMs: number): void {
    this.bkdView.config.getDecoderConfig().duplicatesDelayMs = duplicateDelayMs;
  }

  /**
   * Sets the caching duration (in milliseconds) for multi-code results
   */
  setMulticodeCachingDuration(multicodeCachingDuration: number): void {
    this.bkdConfig.SetMulticodeCachingDuration(multicodeCachingDuration);
  }

  /**
   * Sets whether multi-code caching is enabled
   */
  setMulticodeCachingEnabled(multiCodeCachingEnabled: boolean): void {
    this.bkdConfig.SetMulticodeCachingEnabled(multiCodeCachingEnabled);
  }

  /**
   * Retrieves the maximum number of results to be returned from barcode scanning at once
   */
  getMaximumResultsCount(): any {
    return this.bkdView.config.getDecoderConfig().maximumResultsCount;
  }

  /**
   * Retrieves the delay in milliseconds for considering duplicate barcodes during scanning
   */
  getDuplicatesDelayMs(): any {
    return this.bkdView.config.getDecoderConfig().duplicatesDelayMs;
  }

  /**
   * Sets whether the Direct Part Marking (DPM) mode for Datamatrix barcodes is enabled.
   */
  setDatamatrixDpmModeEnabled(dpmModeEnabled: boolean): void {
    this.bkdView.config.getDecoderConfig().Datamatrix.dpmMode = dpmModeEnabled;
  }

  setQRDpmModeEnabled(dpmModeEnabled: boolean): void {
    this.bkdView.config.getDecoderConfig().QR.dpmMode = dpmModeEnabled;
  }

  setQRMicroDpmModeEnabled(dpmModeEnabled: boolean): void {
    this.bkdView.config.getDecoderConfig().QRMicro.dpmMode = dpmModeEnabled;
  }

  isDatamatrixDpmModeEnabled(): any {
    return this.bkdView.config.getDecoderConfig().Datamatrix.dpmMode;
  }

  isQRDpmModeEnabled() : any {
    return this.bkdView.config.getDecoderConfig().QR.dpmMode
  }

  isQRMicroDpmModeEnabled() : any {
    return this.bkdView.config.getDecoderConfig().QRMicro.dpmMode
  }

  /**
   * Sets whether the deblurring feature for UPC/EAN barcodes is enabled
   */
  setUpcEanDeblurEnabled(enabled: boolean): void {
    this.bkdView.config.getDecoderConfig().upcEanDeblur = enabled;
  }

  /**
   * Sets whether the detection of misshaped 1D barcodes is enabled
   */
  setEnableMisshaped1DEnabled(enabled: boolean): void {
    this.bkdView.config.getDecoderConfig().enableMisshaped1D = enabled;
  }

  /**
   * Sets whether to enable barcode thumbnail on result
   */
  setBarcodeThumbnailOnResultEnabled(enabled: boolean): void {
    this.bkdView.config.setThumbnailOnResultEnabled(enabled);
  }

  /**
   * Retrieve whether to enable barcode thumbnail on result
   */
  isBarcodeThumbnailOnResultEnabled(): any {
    return this.bkdView.config.getThumbnailOnResulEnabled();
  }

  /**
   * Sets the threshold between duplicate scans
   */
  setThresholdBetweenDuplicatesScans(
    thresholdBetweenDuplicatesScans: number
  ): void {
    this.bkdView.config.setThresholdBetweenDuplicatesScans(
      thresholdBetweenDuplicatesScans
    );
  }

  /**
   * Retrieves the threshold between duplicate scans
   */
  getThresholdBetweenDuplicatesScans(): Promise<any> {
    return this.bkdView.config.getThresholdBetweenDuplicatesScans();
  }

  /**
   * Retrieves whether multi-code caching is enabled
   */
  getMulticodeCachingEnabled(): any {
    return this.bkdConfig.IsMulticodeCachingEnabled();
  }

  /**
   * Retrieves the caching duration (in milliseconds) for multi-code results
   */
  getMulticodeCachingDuration(): any {
    return this.bkdConfig.GetMulticodeCachingDuration();
  }

  /**
   * Retrieves the value indicating whether deblurring is enabled for UPC/EAN barcodes
   */
  isUpcEanDeblurEnabled(): any {
    return this.bkdView.config.getDecoderConfig().upcEanDeblur;
  }

  /**
   * Checks if the detection of misshaped 1D barcodes is enabled
   */
  isMisshaped1DEnabled(): any {
    return this.bkdView.config.getDecoderConfig().enableMisshaped1D;
  }

  /**
   * Checks if VIN restrictions are enabled
   */
  isVINRestrictionsEnabled(): any {
    return this.bkdView.config.getDecoderConfig().enableVINRestrictions;
  }

  /**
   * Sets whether Vehicle Identification Number (VIN) restrictions are enabled
   */
  setEnableVINRestrictions(vinRestrictionsEnabled: boolean): void {
    this.bkdView.config.getDecoderConfig().enableVINRestrictions = vinRestrictionsEnabled;
  }

  setLicenseKey(licenseKey: string): void {
    this.bkdView.config = new com.barkoder.BarkoderConfig(
      context,
      licenseKey,
      null
    );
  }

  /**
   * Configures the Barkoder functionality based on the provided configuration
   */
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
