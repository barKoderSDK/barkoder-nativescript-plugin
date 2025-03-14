import { BarkoderConstants } from "./barkoder-nativescript.common";
import { View } from "@nativescript/core";
import { ios } from "@nativescript/core/application";

export class BarkoderViewIOS extends View {
  public bkdView: any;
  public licenseKeyProperty: any;
  private _licenseKey: string;

  constructor() {
    super();
    this.bkdView = BarkoderView.new();
    this.nativeView = this.bkdView;
  }

  /**
   * Initiates the barcode scanning process, allowing the application to detect and decode barcodes from the device's camera feed
   */
  startScanning(callback: BarkoderConstants.BarkoderResultCallback): void {
    const resultDelegate = new BarkoderViewWraper(callback);
    ios.delegate = resultDelegate;
    this.bkdView.startScanningError(resultDelegate);
  }

  scanImage(base64Image: string, callback: BarkoderConstants.BarkoderResultCallback): void {

    // Convert Base64 to UIImage
    const uiImage = this.convertBase64ToUIImage(base64Image);
    const resultDelegate = new BarkoderViewWraper(callback);
    ios.delegate = resultDelegate;
    BarkoderHelper.scanImageBkdConfigResultDelegate(uiImage,this.bkdView.config, resultDelegate)
  }

  convertBase64ToUIImage(base64String: string): UIImage | null {
    if (!base64String) {
      console.warn('Invalid Base64 string provided');
      return null;
    }

    // Decode the Base64 string to NSData
    const imageData = NSData.alloc().initWithBase64EncodedStringOptions(base64String, 0); // Using 0 as the option

    if (!imageData) {
      console.warn('Failed to decode Base64 string to NSData');
      return null;
    }

    // Create a UIImage from NSData
    const uiImage = UIImage.imageWithData(imageData);
    return uiImage;
  }

  /**
   * Halts the barcode scanning process, stopping the camera from capturing and processing barcode information
   */
  stopScanning(): void {
    this.bkdView.stopScanning();
  }

  /**
   * Halts the barcode scanning process, stopping the camera from capturing and processing barcode information
   */
  pauseScanning(): void {
    this.bkdView.pauseScanning();
  }

  /**
   * Checks whether the device has a built-in flash (torch) that can be used for illumination during barcode scanning
   */
  isFlashAvailable(
    callback: BarkoderConstants.FlashAvailableCallback
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.bkdView.isFlashAvailable((flashAvailable: boolean) => {
        resolve(flashAvailable);
        callback.onFlashAvailable(flashAvailable);
      });
    });
  }

  /**
   * Enables or disables the device's flash (torch) for illumination during barcode scanning
   */
  setFlashEnabled(enabled: boolean): void {
    this.bkdView.setFlash(enabled);
  }

  /**
   * Retrieves the maximum available zoom factor for the device's camera
   */
  getMaxZoomFactor(
    callback: BarkoderConstants.MaxZoomAvailableCallback
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.bkdView.getMaxZoomFactor((maxZoomFactor: number) => {
        resolve(maxZoomFactor);
        callback.onMaxZoomAvailable(maxZoomFactor);
      });
    });
  }

  /**
   * Sets the zoom factor for the device's camera, adjusting the level of zoom during barcode scanning
   */
  setZoomFactor(zoomFactor: number): void {
    this.bkdView.setZoomFactor(zoomFactor);
  }

  /**
   * Retrieves the hexadecimal color code representing the line color used to indicate the location of detected barcodes
   */
  getLocationLineColorHex(): any {
    return this.bkdView.config.locationLineColor;
  }

  /**
   * Sets the color of the lines used to indicate the location of detected barcodes on the camera feed
   */
  setLocationLineColor(locationLineHexColor: string): void {
    const uiColor = this.hexToUIColor(locationLineHexColor);
    this.bkdView.config.locationLineColor = uiColor;
  }

  /**
   * Sets the color of the lines outlining the Region of Interest (ROI) for barcode scanning on the camera feed
   */
  setRoiLineColor(roiLineHexColor: string): void {
    const uiColor = this.hexToUIColor(roiLineHexColor);
    this.bkdView.config.roiLineColor = uiColor;
  }

  /**
   * Sets the width of the lines outlining the Region of Interest (ROI) for barcode scanning on the camera feed
   */
  setRoiLineWidth(roiLineWidth: number): void {
    this.bkdView.config.roiLineWidth = roiLineWidth;
  }

  /**
   * Sets the background color of the overlay within the Region of Interest (ROI) for barcode scanning on the camera feed
   */
  setRoiOverlayBackgroundColor(roiLineHexColor: string): void {
    const uiColor = this.hexToUIColor(roiLineHexColor);
    this.bkdView.config.roiOverlayBackgroundColor = uiColor;
  }

  /**
   * Enables or disables the automatic closing of the scanning session upon detecting a barcode result
   */
  setCloseSessionOnResultEnabled(enabled: boolean): void {
    this.bkdView.config.closeSessionOnResultEnabled = enabled;
  }

  /**
   * Enables or disables the capturing and processing of image data when a barcode is successfully detected
   */
  setImageResultEnabled(enabled: boolean): void {
    this.bkdView.config.imageResultEnabled = enabled;
  }

  /**
   * Enables or disables the inclusion of barcode location information within the image data result
   */
  setLocationInImageResultEnabled(enabled: boolean): void {
    this.bkdView.config.locationInImageResultEnabled = enabled;
  }

  /**
   * Enables or disables the display of barcode location information on the camera preview
   */
  setLocationInPreviewEnabled(enabled: boolean): void {
    this.bkdView.config.locationInPreviewEnabled = enabled;
  }

  /**
   * Enables or disables the pinch-to-zoom feature for adjusting the zoom level during barcode scanning
   */
  setPinchToZoomEnabled(enabled: boolean): void {
    this.bkdView.config.pinchToZoomEnabled = enabled;
  }

  /**
   * Sets the visibility of the Region of Interest (ROI) on the camera preview
   */
  setRegionOfInterestVisible(enabled: boolean): void {
    this.bkdView.config.regionOfInterestVisible = enabled;
  }

  setIdDocumentMasterChecksumEnabled(enabled: boolean): void {
    if (enabled) {
      this.bkdView.config.decoderConfig.idDocument.masterChecksum = 1
    } else {
      this.bkdView.config.decoderConfig.idDocument.masterChecksum = 0
    }
  }

  isIdDocumentMasterChecksumEnabled(): boolean {
    return this.bkdView.config.decoderConfig.idDocument.masterChecksum === 1
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
    const rect = {
      origin: { x: left, y: top },
      size: { width: width, height: height },
    };

    this.bkdView.config.setRegionOfInterestError(rect);
  }

  /**
   * Enables or disables the audible beep sound upon successfully decoding a barcode
   */
  setBeepOnSuccessEnabled(enabled: boolean): void {
    this.bkdView.config.beepOnSuccessEnabled = enabled;
  }

  /**
   * Enables or disables the device vibration upon successfully decoding a barcode.
   */
  setVibrateOnSuccessEnabled(enabled: boolean): void {
    this.bkdView.config.vibrateOnSuccessEnabled = enabled;
  }

  /**
   * Retrieves the character set used for encoding barcode data
   */
  getEncodingCharacterSet(): any {
    return this.bkdView.config.decoderConfig.encodingCharacterSet;
  }

  /**
   * Retrieves the current decoding speed setting for barcode scanning
   */
  getDecodingSpeed(): any {
    return this.bkdView.config.decoderConfig.decodingSpeed;
  }

  /**
   * Retrieves the formatting type used for presenting decoded barcode data.
   */
  getFormattingType(): any {
    return this.bkdView.config.decoderConfig.formatting;
  }

  /**
   * Sets the width of the lines indicating the location of detected barcodes on the camera feed
   */
  setLocationLineWidth(width: number): void {
    this.bkdView.config.locationLineWidth = width;
  }

  /**
   * Retrieves the current width setting for the lines indicating the location of detected barcodes on the camera feed
   */
  getLocationLineWidth(): any {
    return this.bkdView.config.locationLineWidth;
  }

  /**
   * Retrieves the hexadecimal color code representing the line color of the Region of Interest (ROI) on the camera preview
   */
  getRoiLineColorHex(): any {
    return this.bkdView.config.roiLineColor;
  }

  /**
   * Retrieves the current width setting for the lines outlining the Region of Interest (ROI) on the camera preview
   */
  getRoiLineWidth(): any {
    return this.bkdView.config.roiLineWidth;
  }

  /**
   * Retrieves the hexadecimal color code representing the background color of the overlay within the Region of Interest (ROI) on the camera preview
   */
  getRoiOverlayBackgroundColorHex(): any {
    return this.bkdView.config.roiOverlayBackgroundColor;
  }

  /**
   * Enables or disables the automatic closing of the scanning session upon detecting a barcode result
   */
  isCloseSessionOnResultEnabled(): any {
    return this.bkdView.config.closeSessionOnResultEnabled;
  }

  /**
   * Enables or disables the capturing and processing of image data when a barcode is successfully detected
   */
  isImageResultEnabled(): any {
    return this.bkdView.config.imageResultEnabled;
  }

  /**
   * Enables or disables the inclusion of barcode location information within the image data result
   */
  isLocationInImageResultEnabled(): any {
    return this.bkdView.config.locationInImageResultEnabled;
  }

  /**
   * Retrieves the region of interest (ROI)
   */
  getRegionOfInterest(): any {
    return this.bkdView.config.getRegionOfInterest;
  }

  /**
   * Retrieves the threads limit
   */
  getThreadsLimit(): any {
    return this.bkdView.config.getThreadsLimit();
  }

  /**
   * Sets the threads limit
   */
  setThreadsLimit(threadsLimit: number): void {
    this.bkdView.config.setThreadsLimitError(threadsLimit);
  }

  /**
   * Checks if location in preview is enabled
   */
  isLocationInPreviewEnabled(): any {
    return this.bkdView.config.locationInPreviewEnabled;
  }

  /**
   * Checks if pinch to zoom is enabled
   */
  isPinchToZoomEnabled(): any {
    return this.bkdView.config.pinchToZoomEnabled;
  }

  /**
   * Checks if the region of interest (ROI) is visible
   */
  isRegionOfInterestVisible(): any {
    return this.bkdView.config.regionOfInterestVisible;
  }

  /**
   * Retrieves the value indicating whether a beep sound is played on successful barcode scanning
   */
  isBeepOnSuccessEnabled(): any {
    return this.bkdView.config.beepOnSuccessEnabled;
  }

  /**
   * Retrieves the value indicating whether vibration is enabled on successful barcode scanning
   */
  isVibrateOnSuccessEnabled(): any {
    return this.bkdView.config.vibrateOnSuccessEnabled;
  }

  /**
   * Retrieves the version of the Barkoder library
   */
  getVersion(): any {
    return iBarkoder.GetVersion();
  }

  /**
   * Retrieves the MSI checksum type
   */
  getMsiCheckSumType(): any {
    return this.bkdView.config.decoderConfig.msi.checksum;
  }

  /**
   * Retrieves the checksum type for Code 39 barcodes
   */
  getCode39CheckSumType(): any {
    return this.bkdView.config.decoderConfig.code39.checksum;
  }

  /**
   * Retrieves the Code11 checksum type
   */
  getCode11CheckSumType(): any {
    return this.bkdView.config.decoderConfig.code11.checksum;
  }

  /**
   * Sets the resolution for barcode scanning
   */
  setBarkoderResolution(
    barkoderResolution: BarkoderConstants.BarkoderResolution
  ): void {
    if (barkoderResolution === BarkoderConstants.BarkoderResolution.HD) {
      this.bkdView.config.barkoderResolution = 0;
    } else if (
      barkoderResolution === BarkoderConstants.BarkoderResolution.FHD
    ) {
      this.bkdView.config.barkoderResolution = 1;
    }
    else if (
      barkoderResolution === BarkoderConstants.BarkoderResolution.UHD
    ) {
      this.bkdView.config.barkoderResolution = 2;
    }
  }

  /**
   * Retrieves the resolution for barcode scanning
   */
  getBarkoderResolution(): any {
    return this.bkdView.config.barkoderResolution;
  }

  /**
   * Sets the encoding character set for barcode scanning
   */
  setEncodingCharacterSet(encodingCharacterSet: any): void {
    this.bkdView.config.encodingCharacterSet = encodingCharacterSet;
  }

  /**
   * Sets the decoding speed for barcode scanning
   */
  setDecodingSpeed(decodingSpeed: BarkoderConstants.DecodingSpeed): void {
    if (decodingSpeed == BarkoderConstants.DecodingSpeed.Fast) {
      this.bkdView.config.decoderConfig.decodingSpeed = 0;
    } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Normal) {
      this.bkdView.config.decoderConfig.decodingSpeed = 1;
    } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Slow) {
      this.bkdView.config.decoderConfig.decodingSpeed = 2;
    }
  }

  /**
   * Sets the formatting type for barcode scanning
   */
  setFormattingType(formattingType: BarkoderConstants.FormattingType): void {
    switch (formattingType) {
      case BarkoderConstants.FormattingType.Disabled:
        this.bkdView.config.decoderConfig.formatting = 0;
        break;
      case BarkoderConstants.FormattingType.Automatic:
        this.bkdView.config.decoderConfig.formatting = 1;
        break;
      case BarkoderConstants.FormattingType.GS1:
        this.bkdView.config.decoderConfig.formatting = 2;
        break;
      case BarkoderConstants.FormattingType.AAMVA:
        this.bkdView.config.decoderConfig.formatting = 3;
        break;
    }
  }

  /**
   * Sets the MSI checksum type
   */
  setMsiCheckSumType(msiCheckSumType: BarkoderConstants.MsiChecksumType) {
    switch (msiCheckSumType) {
      case BarkoderConstants.MsiChecksumType.Disabled:
        this.bkdView.config.decoderConfig.msi.checksum = 0;
        break;
      case BarkoderConstants.MsiChecksumType.Mod10:
        this.bkdView.config.decoderConfig.msi.checksum = 1;
        break;
      case BarkoderConstants.MsiChecksumType.Mod11:
        this.bkdView.config.decoderConfig.msi.checksum = 2;
        break;
      case BarkoderConstants.MsiChecksumType.Mod1010:
        this.bkdView.config.decoderConfig.msi.checksum = 3;
        break;
      case BarkoderConstants.MsiChecksumType.Mod1110:
        this.bkdView.config.decoderConfig.msi.checksum = 4;
        break;
      case BarkoderConstants.MsiChecksumType.Mod11IBM:
        this.bkdView.config.decoderConfig.msi.checksum = 5;
        break;
      case BarkoderConstants.MsiChecksumType.Mod1110IBM:
        this.bkdView.config.decoderConfig.msi.checksum = 6;
        break;
    }
  }

  /**
   * Sets the Code39 checksum type
   */
  setCode39CheckSumType(
    standardCheckSumType: BarkoderConstants.Code39ChecksumType
  ) {
    switch (standardCheckSumType) {
      case BarkoderConstants.Code39ChecksumType.Disabled:
        this.bkdView.config.decoderConfig.code39.checksum = 0;
        break;
      case BarkoderConstants.Code39ChecksumType.Enabled:
        this.bkdView.config.decoderConfig.code39.checksum = 1;
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
        this.bkdView.config.decoderConfig.code11.checksum = 0;
        break;
      case BarkoderConstants.Code11ChecksumType.Single:
        this.bkdView.config.decoderConfig.code11.checksum = 1;
        break;
      case BarkoderConstants.Code11ChecksumType.Double:
        this.bkdView.config.decoderConfig.code11.checksum = 2;
        break;
    }
  }

  /**
   * Checks if a specific barcode type is enabled
   */
  isBarcodeTypeEnabled(decoder: BarkoderConstants.DecoderType): any {
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
      case BarkoderConstants.DecoderType.IDDocument:
        return this.bkdView.config.decoderConfig.idDocument.enabled;
      case BarkoderConstants.DecoderType.DatabarLimited:
        return this.bkdView.config.decoderConfig.databarLimited.enabled;
      case BarkoderConstants.DecoderType.DatabarExpanded:
        return this.bkdView.config.decoderConfig.databarExpanded.enabled;
      case BarkoderConstants.DecoderType.Databar14:
        return this.bkdView.config.decoderConfig.databar14.enabled;
      case BarkoderConstants.DecoderType.PostalIMB:
        return this.bkdView.config.decoderConfig.postalIMB.enabled;
      case BarkoderConstants.DecoderType.Planet:
        return this.bkdView.config.decoderConfig.planet.enabled;
      case BarkoderConstants.DecoderType.Postnet:
        return this.bkdView.config.decoderConfig.postnet.enabled;
      case BarkoderConstants.DecoderType.AustralianPost:
        return this.bkdView.config.decoderConfig.australianPost.enabled;
      case BarkoderConstants.DecoderType.RoyalMail:
        return this.bkdView.config.decoderConfig.royalMail.enabled;
      case BarkoderConstants.DecoderType.KIX:
        return this.bkdView.config.decoderConfig.kix.enabled;
      case BarkoderConstants.DecoderType.JapanesePost:
        return this.bkdView.config.decoderConfig.japanasePost.enabled;
    }
  }

  /**
   * Sets whether a specific barcode type is enabled
   */
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
    this.bkdView.config.decoderConfig.idDocument.enabled = false;
    this.bkdView.config.decoderConfig.databar14.enabled = false;
    this.bkdView.config.decoderConfig.databarLimited.enabled = false;
    this.bkdView.config.decoderConfig.databarExpanded.enabled = false;
    this.bkdView.config.decoderConfig.postalIMB.enabled = false;
    this.bkdView.config.decoderConfig.planet.enabled = false;
    this.bkdView.config.decoderConfig.postnet.enabled = false;
    this.bkdView.config.decoderConfig.australianPost.enabled = false;
    this.bkdView.config.decoderConfig.royalMail.enabled = false;
    this.bkdView.config.decoderConfig.kix.enabled = false;
    this.bkdView.config.decoderConfig.japanesePost.enabled = false;
    decoders.forEach((dt: BarkoderConstants.DecoderType) => {
      switch (dt) {
        case BarkoderConstants.DecoderType.Aztec:
          this.bkdView.config.decoderConfig.aztec.enabled = true;
          break;
        case BarkoderConstants.DecoderType.AztecCompact:
          this.bkdView.config.decoderConfig.aztecCompact.enabled = true;
          break;
        case BarkoderConstants.DecoderType.QR:
          this.bkdView.config.decoderConfig.qr.enabled = true;
          break;
        case BarkoderConstants.DecoderType.QRMicro:
          this.bkdView.config.decoderConfig.qrMicro.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Code128:
          this.bkdView.config.decoderConfig.code128.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Code93:
          this.bkdView.config.decoderConfig.code93.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Code39:
          this.bkdView.config.decoderConfig.code39.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Telepen:
          this.bkdView.config.decoderConfig.telepen.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Code11:
          this.bkdView.config.decoderConfig.code11.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Msi:
          this.bkdView.config.decoderConfig.msi.enabled = true;
          break;
        case BarkoderConstants.DecoderType.UpcA:
          this.bkdView.config.decoderConfig.upcA.enabled = true;
          break;
        case BarkoderConstants.DecoderType.UpcE:
          this.bkdView.config.decoderConfig.upcE.enabled = true;
          break;
        case BarkoderConstants.DecoderType.UpcE1:
          this.bkdView.config.decoderConfig.upcE1.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Ean13:
          this.bkdView.config.decoderConfig.ean13.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Ean8:
          this.bkdView.config.decoderConfig.ean8.enabled = true;
          break;
        case BarkoderConstants.DecoderType.PDF417:
          this.bkdView.config.decoderConfig.PDF417.enabled = true;
          break;
        case BarkoderConstants.DecoderType.PDF417Micro:
          this.bkdView.config.decoderConfig.PDF417Micro.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Datamatrix:
          this.bkdView.config.decoderConfig.datamatrix.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Code25:
          this.bkdView.config.decoderConfig.code25.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Interleaved25:
          this.bkdView.config.decoderConfig.interleaved25.enabled = true;
          break;
        case BarkoderConstants.DecoderType.ITF14:
          this.bkdView.config.decoderConfig.itf14.enabled = true;
          break;
        case BarkoderConstants.DecoderType.IATA25:
          this.bkdView.config.decoderConfig.iata25.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Matrix25:
          this.bkdView.config.decoderConfig.matrix25.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Datalogic25:
          this.bkdView.config.decoderConfig.datalogic25.enabled = true;
          break;
        case BarkoderConstants.DecoderType.COOP25:
          this.bkdView.config.decoderConfig.coop25.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Dotcode:
          this.bkdView.config.decoderConfig.dotcode.enabled = true;
          break;
        case BarkoderConstants.DecoderType.IDDocument:
          this.bkdView.config.decoderConfig.idDocument.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Codabar:
          this.bkdView.config.decoderConfig.codabar.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Databar14:
          this.bkdView.config.decoderConfig.databar14.enabled = true;
          break;
        case BarkoderConstants.DecoderType.DatabarExpanded:
          this.bkdView.config.decoderConfig.databarExpanded.enabled = true;
          break;
        case BarkoderConstants.DecoderType.DatabarLimited:
          this.bkdView.config.decoderConfig.databarLimited.enabled = true;
          break;
        case BarkoderConstants.DecoderType.PostalIMB:
          this.bkdView.config.decoderConfig.postalIMB.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Planet:
          this.bkdView.config.decoderConfig.planet.enabled = true;
          break;
        case BarkoderConstants.DecoderType.Postnet:
          this.bkdView.config.decoderConfig.postnet.enabled = true;
          break;
        case BarkoderConstants.DecoderType.AustralianPost:
          this.bkdView.config.decoderConfig.australianPost.enabled = true;
          break;
        case BarkoderConstants.DecoderType.RoyalMail:
          this.bkdView.config.decoderConfig.royalMail.enabled = true;
          break;
        case BarkoderConstants.DecoderType.KIX:
          this.bkdView.config.decoderConfig.kix.enabled = true;
          break;
        case BarkoderConstants.DecoderType.JapanesePost:
          this.bkdView.config.decoderConfig.japanesePost.enabled = true;
          break;
        default:
          break;
      }
    });
  }

  getBarcodeTypeMaximumLenght(decoder: BarkoderConstants.DecoderType): any {
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

  getBarcodeTypeMinimumLenght(decoder: BarkoderConstants.DecoderType): any {
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
        this.bkdView.config.decoderConfig.aztec.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.AztecCompact:
        this.bkdView.config.decoderConfig.aztecCompact.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.QR:
        this.bkdView.config.decoderConfig.qr.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.QRMicro:
        this.bkdView.config.decoderConfig.qrMicro.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Code128:
        this.bkdView.config.decoderConfig.code128.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Code93:
        this.bkdView.config.decoderConfig.code93.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Code39:
        this.bkdView.config.decoderConfig.code39.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Telepen:
        this.bkdView.config.decoderConfig.telepen.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Code11:
        this.bkdView.config.decoderConfig.code11.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Msi:
        this.bkdView.config.decoderConfig.msi.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.UpcA:
        this.bkdView.config.decoderConfig.upcA.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.UpcE:
        this.bkdView.config.decoderConfig.upcE.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.UpcE1:
        this.bkdView.config.decoderConfig.upcE1.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Ean13:
        this.bkdView.config.decoderConfig.ean13.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Ean8:
        this.bkdView.config.decoderConfig.ean8.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.PDF417:
        this.bkdView.config.decoderConfig.PDF417.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.PDF417Micro:
        this.bkdView.config.decoderConfig.PDF417Micro.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Datamatrix:
        this.bkdView.config.decoderConfig.datamatrix.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Code25:
        this.bkdView.config.decoderConfig.code25.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Interleaved25:
        this.bkdView.config.decoderConfig.interleaved25.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.ITF14:
        this.bkdView.config.decoderConfig.itf14.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.IATA25:
        this.bkdView.config.decoderConfig.iata25.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Matrix25:
        this.bkdView.config.decoderConfig.matrix25.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Datalogic25:
        this.bkdView.config.decoderConfig.datalogic25.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.COOP25:
        this.bkdView.config.decoderConfig.coop25.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      case BarkoderConstants.DecoderType.Dotcode:
        this.bkdView.config.decoderConfig.dotcode.setLengthRangeWithMinimumMaximum(
          minimumLength,
          maximumLength
        );
        break;
      default:
        break;
    }
  }

  /**
   * Sets the maximum number of results to be returned from barcode scanning
   */
  setMaximumResultsCount(maximumResultsCount: number): void {
    this.bkdView.config.decoderConfig.maximumResultsCount = maximumResultsCount;
  }

  /**
   * Sets the delay in milliseconds for considering duplicate barcodes during scanning
   */
  setDuplicatesDelayMs(duplicateDelayMs: number): void {
    this.bkdView.config.decoderConfig.duplicatesDelayMs = duplicateDelayMs;
  }

  /**
   * Sets the caching duration (in milliseconds) for multi-code results
   */
  setMulticodeCachingDuration(multicodeCachingDuration: number): void {
    this.bkdView.config.setMulticodeCachingDuration(multicodeCachingDuration);
  }

  /**
   * Sets whether multi-code caching is enabled
   */
  setMulticodeCachingEnabled(multiCodeCachingEnabled: boolean): void {
    this.bkdView.config.setMulticodeCachingEnabled(multiCodeCachingEnabled);
  }

  /**
   * Sets whether the Direct Part Marking (DPM) mode for Datamatrix barcodes is enabled.
   */
  setDatamatrixDpmModeEnabled(dpmModeEnabled: boolean): void {
    if (dpmModeEnabled) {
      this.bkdView.config.decoderConfig.datamatrix.dpmMode = 1;
    } else if (dpmModeEnabled == false) {
      this.bkdView.config.decoderConfig.datamatrix.dpmMode = 0;
    }
  }

  setQRDpmModeEnabled(dpmModeEnabled: boolean): void {
    if (dpmModeEnabled) {
      this.bkdView.config.decoderConfig.qr.dpmMode = 1;
    } else if (dpmModeEnabled == false) {
      this.bkdView.config.decoderConfig.qr.dpmMode = 0;
    }
  }

  setQRMicroDpmModeEnabled(dpmModeEnabled: boolean): void {
    if (dpmModeEnabled) {
      this.bkdView.config.decoderConfig.qrMicro.dpmMode = 1;
    } else if (dpmModeEnabled == false) {
      this.bkdView.config.decoderConfig.qrMicro.dpmMode = 0;
    }
  }

  isDatamatrixDpmModeEnabled(): any {
    return this.bkdView.config.decoderConfig.datamatrix.dpmMode;
  }

  isQRDpmModeEnabled(): any {
    return this.bkdView.config.decoderConfig.qr.dpmMode
  }

  isQRMicroDpmModeEnabled(): any {
    return this.bkdView.config.decoderConfig.qrMicro.dpmMode
  }

  /**
   * Retrieves the delay in milliseconds for considering duplicate barcodes during scanning
   */
  getDuplicatesDelayMs(): any {
    return this.bkdView.config.decoderConfig.duplicatesDelayMs;
  }

  /**
   * Retrieves the maximum number of results to be returned from barcode scanning at once
   */
  getMaximumResultsCount(): any {
    return this.bkdView.config.decoderConfig.maximumResultsCount;
  }

  /**
   * Sets whether the deblurring feature for UPC/EAN barcodes is enabled
   */
  setUpcEanDeblurEnabled(enabled: boolean): void {
    this.bkdView.config.decoderConfig.upcEanDeblur = enabled;
  }

  /**
   * Sets whether the detection of misshaped 1D barcodes is enabled
   */
  setEnableMisshaped1DEnabled(enabled: boolean): void {
    this.bkdView.config.decoderConfig.enableMisshaped1D = enabled;
  }

  /**
   * Sets whether to enable barcode thumbnail on result
   */
  setBarcodeThumbnailOnResultEnabled(enabled: boolean): void {
    this.bkdView.config.barcodeThumbnailOnResult = enabled;
  }

  /**
   * Retrieve whether to enable barcode thumbnail on result
   */
  isBarcodeThumbnailOnResultEnabled(): any {
    return this.bkdView.config.barcodeThumbnailOnResult;
  }

  /**
   * Sets the threshold between duplicate scans
   */
  setThresholdBetweenDuplicatesScans(
    thresholdBetweenDuplicatesScans: number
  ): void {
    this.bkdView.config.thresholdBetweenDuplicatesScans = thresholdBetweenDuplicatesScans;
  }

  /**
   * Retrieves the threshold between duplicate scans
   */
  getThresholdBetweenDuplicatesScans(): any {
    return this.bkdView.config.thresholdBetweenDuplicatesScans;
  }

  /**
   * Retrieves whether multi-code caching is enabled
   */
  getMulticodeCachingEnabled(): any {
    return this.bkdView.config.getMulticodeCachingEnabled();
  }

  /**
   * Retrieves the caching duration (in milliseconds) for multi-code results
   */
  getMulticodeCachingDuration(): any {
    return this.bkdView.config.getMulticodeCachingDuration();
  }

  /**
   * Retrieves the value indicating whether deblurring is enabled for UPC/EAN barcodes
   */
  isUpcEanDeblurEnabled(): any {
    return this.bkdView.config.decoderConfig.upcEanDeblur;
  }

  /**
   * Checks if the detection of misshaped 1D barcodes is enabled
   */
  isMisshaped1DEnabled(): any {
    return this.bkdView.config.decoderConfig.enableMisshaped1D;
  }

  /**
   * Checks if VIN restrictions are enabled
   */
  isVINRestrictionsEnabled(): any {
    return this.bkdView.config.decoderConfig.enableVINRestrictions;
  }

  /**
   * Sets whether Vehicle Identification Number (VIN) restrictions are enabled
   */
  setEnableVINRestrictions(vinRestrictionsEnabled: boolean): void {
    this.bkdView.config.decoderConfig.enableVINRestrictions = vinRestrictionsEnabled;
  }

  isEnabledComposite(): any {
    return this.bkdView.config.decoderConfig.enableComposite;
  }

  /**
   * Sets whether Vehicle Identification Number (VIN) restrictions are enabled
   */
  setEnabledComposite(enableComposited: number): void {
    this.bkdView.config.decoderConfig.enableComposite = enableComposited;
  }

  setScanningIndicatorColor(scanningIndicatorColor: string): void {
    const uiColor = this.hexToUIColor(scanningIndicatorColor);
    this.bkdView.config.scanningIndicatorColor = uiColor;
  }

  getScanningIndicatorColorHex(): any {
    return this.bkdView.config.scanningIndicatorColor
  }

  setScanningIndicatorWidth(scanningIndicatorWidth: number): void {
    this.bkdView.config.scanningIndicatorWidth = scanningIndicatorWidth;
  }

  getScanningIndicatorWidth(): any {
    return this.bkdView.config.scanningIndicatorWidth
  }

  setScanningIndicatorAnimation(indicatorMode: number): void {
    this.bkdView.config.scanningIndicatorAnimation = indicatorMode;
  }

  getScanningIndicatorAnimation(): any {
    return this.bkdView.config.scanningIndicatorAnimation
  }

  setScanningIndicatorAlwaysVisible(enabled: boolean): void {
    this.bkdView.config.scanningIndicatorAlwaysVisible = enabled;
  }

  isScanningIndicatorAlwaysVisible(): any {
    return this.bkdView.config.scanningIndicatorAlwaysVisible;
  }

  setUPCEexpandToUPCA(enabled: boolean): void {
    this.bkdView.config.decoderConfig.upcE.expandToUPCA = enabled
  }

  setUPCE1expandToUPCA(enabled: boolean): void {
    this.bkdView.config.decoderConfig.upcE1.expandToUPCA = enabled
  }

  setCustomOption(string: string, mode: number): void {
    this.bkdView.config.decoderConfig.setcustomOptionValue(string, mode)
  }

  setLicenseKey(licenseKey: string): void {
    const config = new BarkoderConfig({
      licenseKey: licenseKey,
      licenseCheckHandler: (result: LicenseCheckResult) => {},
    });

    this.bkdView.config = config;
  }

  setDynamicExposure(number: number): void {
    this.bkdView.setDynamicExposure(number);
  }
  setCentricFocusAndExposure(enabled : boolean) : void {
    this.bkdView.setCentricFocusAndExposure(enabled);
  }

  setVideoStabilization(enabled: boolean): void {
    this.bkdView.setVideoStabilization(enabled)
  }

  setCamera(cameraPosition: BarkoderConstants.BarkoderCameraPosition): void {
     if(cameraPosition == BarkoderConstants.BarkoderCameraPosition.Front) {
       this.bkdView.setCamera(BarkoderCameraPosition.FRONT);
        } else if (cameraPosition == BarkoderConstants.BarkoderCameraPosition.Back) {
       this.bkdView.setCamera(BarkoderCameraPosition.BACK);
        }
  }


  /**
   * Configures the Barkoder functionality based on the provided configuration
   */
  configureBarkoder(config: BarkoderConstants.BarkoderConfig): void {
    const nsString = NSString.stringWithString(config.toJsonString());
    const jsonData = nsString.dataUsingEncoding(NSUTF8StringEncoding);
    BarkoderHelper.applyConfigSettingsFromJsonJsonDataFinished(
      this.bkdView.config,
      jsonData,
      (resultConfig: BarkoderConfig, error: NSError) => {
        if (error) {
          console.error(
            "Error applying config settings:",
            error.localizedDescription
          );
        } else {
          console.log("Config settings applied successfully:", resultConfig);
        }
      }
    );
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
export class BarkoderViewWraper extends UIResponder
  implements BarkoderResultDelegate {
  public callback: any;
  static ObjCProtocols = [BarkoderResultDelegate];

  constructor(callback: BarkoderConstants.BarkoderResultCallback) {
    super();
    this.callback = callback;
  }

  scanningFinishedThumbnailsImage(
    decoderResults: NSArray<DecoderResult> | DecoderResult[],
    thumbnails: NSArray<UIImage> | UIImage[],
    image: UIImage
  ): void {
    this.callback.scanningFinished(decoderResults, thumbnails, image);
  }

  static new(): BarkoderViewWraper {
    return super.new.call(this);
  }
}
