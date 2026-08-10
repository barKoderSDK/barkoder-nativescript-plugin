import { BarkoderConstants } from "./barkoder-nativescript.common";
import * as application from "@nativescript/core/application";
import { Color, View } from "@nativescript/core";
import { BarkoderView } from "./barkoder-nativescript.common";
import { ImageSource } from '@nativescript/core';



const androidSupport =
  global.androidx && global.androidx.appcompat
    ? global.androidx.core.app
    : android.support.v4.app;
declare const com, global: any;

const context = application.android.context;
const Manifest = android.Manifest;
 const activityContext = application.android.foregroundActivity || application.android.startActivity;
export class BarkoderViewAndroid extends View {
  public bkdView: any;
  public bkd: any;
  public bkdConfig: any;
  public bkdHelper: any;
    private _pendingPowerSavingMode: number = null;
  private _pendingLicenseKey: string;
  private _pendingSettings: Array<() => void> = [];
  private _isNativeViewReady = false;

  constructor() {
    super();
    this.bkdConfig = com.barkoder.BarkoderConfig;
    this.bkd = new com.barkoder.Barkoder();
    this.bkdHelper = new com.barkoder.BarkoderHelper();
  }

createNativeView(): Object {
    const ctx = this._context;
    this.bkdView = new com.barkoder.BarkoderView(ctx, true);
    this.bkdView.config = new com.barkoder.BarkoderConfig(
      ctx,
      this._pendingLicenseKey || "LICENSE_KEY",
      null
    );

    // Use setPowerSavingLevel on the VIEW, not config
    if (this._pendingPowerSavingMode !== null) {
      this.bkdView.config.setPowerSavingMode(this._pendingPowerSavingMode);
      this._pendingPowerSavingMode = null;
    }

    return this.bkdView;
  }

  initNativeView(): void {
    super.initNativeView();
    this._isNativeViewReady = true;
    // Flush all queued settings
    for (const fn of this._pendingSettings) {
      fn();
    }
    this._pendingSettings = [];
  }

  disposeNativeView(): void {
    this._isNativeViewReady = false;
    super.disposeNativeView();
  }

  private _runWhenReady(fn: () => void): void {
    if (this._isNativeViewReady && this.bkdView) {
      fn();
    } else {
      this._pendingSettings.push(fn);
    }
  }

  setLicenseKey(licenseKey: string): void {
    if (this.bkdView) {
      this.bkdView.config = new com.barkoder.BarkoderConfig(
        this._context,
        licenseKey,
        null
      );
    } else {
      this._pendingLicenseKey = licenseKey;
    }
  }

  startScanning(
    BarkoderResultCallback: BarkoderConstants.BarkoderResultCallback
  ): void {
    this._runWhenReady(() => {
      const resultCallback = new com.barkoder.interfaces.BarkoderResultCallback({
        scanningFinished: (
          results: any[],
          thumbnails: any,
          resultImage: any
        ) => {
          const jsThumbnails = [];
          if(thumbnails != null) {
            for (let i = 0; i < thumbnails.length; i++) {
              jsThumbnails.push(thumbnails[i]);
            }
          }
          const convertedThumbnails = jsThumbnails.map((bitmap) => {
            const imgSrc = new ImageSource();
            imgSrc.setNativeSource(bitmap);
            return imgSrc;
          });
          const convertedResultImage = new ImageSource();
          convertedResultImage.setNativeSource(resultImage);
          BarkoderResultCallback.scanningFinished(
            results,
            convertedThumbnails,
            convertedResultImage
          );
        },
      });
      this.bkdView.startScanning(resultCallback);
    });
  }

  freezeScanning() {
    this._runWhenReady(() => { this.bkdView.freezeScanning(); });
  }

    unfreezeScanning(): void {
    this._runWhenReady(() => {
      // Call native unfreeze (resumes scanning internally)
      this.bkdView.unfreezeScanning();
    });
  }

  scanImage(
    base64Image: string,
    BarkoderResultCallback: BarkoderConstants.BarkoderResultCallback
  ): void {
    this._runWhenReady(() => {
      const BarkoderHelper = com.barkoder.BarkoderHelper;
      const bitmap = ImageSource.fromBase64Sync(base64Image).android;
      const resultCallback = new com.barkoder.interfaces.BarkoderResultCallback({
        scanningFinished: (
          results: any[],
          thumbnails: any[],
          resultImage: any
        ) => {
          BarkoderResultCallback.scanningFinished(results, thumbnails, resultImage);
        },
      });
      BarkoderHelper.scanImage(bitmap, this.bkdView.config, resultCallback, this._context);
    });
  }

  stopScanning(): void {
    this._runWhenReady(() => { this.bkdView.stopScanning(); });
  }

  captureImage(): void {
    this._runWhenReady(() => { this.bkdView.captureImage(); });
  }

  pauseScanning(): void {
    this._runWhenReady(() => { this.bkdView.pauseScanning(); });
  }

  isFlashAvailable(callback: BarkoderConstants.FlashAvailableCallback) {
    this._runWhenReady(() => {
      const isFlashAvailableCallback = new com.barkoder.interfaces.FlashAvailableCallback({
        onFlashAvailable: (isFlashAvailable: any) => {
          callback.onFlashAvailable(isFlashAvailable);
        },
      });
      this.bkdView.isFlashAvailable(isFlashAvailableCallback);
    });
  }

  setFlashEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.setFlashEnabled(enabled); });
  }

  setARContinueScanningOnLimit(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setContinueScanningOnLimit(enabled); });
  }

  setAREmitResultsAtSessionEndOnly(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.emitResultsAtSessionEndOnly = enabled; });
  }

  getMaxZoomFactor(callback: BarkoderConstants.MaxZoomAvailableCallback) {
    this._runWhenReady(() => {
      const MaxZoomCallback = new com.barkoder.interfaces.MaxZoomAvailableCallback({
        onMaxZoomAvailable: (maxZoomFacttor: any) => {
          callback.onMaxZoomAvailable(maxZoomFacttor);
        },
      });
      this.bkdView.getMaxZoomFactor(MaxZoomCallback);
    });
  }

  setZoomFactor(zoomFactor: number): void {
    this._runWhenReady(() => { this.bkdView.setZoomFactor(zoomFactor); });
  }

  getLocationLineColorHex(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getLocationLineColor();
  }

  setLocationLineColor(locationLineColor: string): void {
    this._runWhenReady(() => {
      const locationColor = this.hexToAndroidColor(locationLineColor);
      this.bkdView.config.setLocationLineColor(locationColor);
    });
  }

  setIdDocumentMasterChecksumEnabled(enabled: boolean): void {
    this._runWhenReady(() => {
      if(enabled){
        this.bkdView.config.getDecoderConfig().IDDocument.masterChecksumType = com.barkoder.Barkoder.StandardChecksumType.Enabled;
      } else {
        this.bkdView.config.getDecoderConfig().IDDocument.masterChecksumType = com.barkoder.Barkoder.StandardChecksumType.Disabled;
      }
    });
  }

  isIdDocumentMasterChecksumEnabled(): boolean {
    if (!this.bkdView) return false;
    return this.bkdView.config.getDecoderConfig().IDDocument.masterChecksumType === com.barkoder.Barkoder.StandardChecksumType.Enabled;
  }

  setRoiLineColor(roiLineColor: string): void {
    this._runWhenReady(() => {
      const roiLineColorHex = this.hexToAndroidColor(roiLineColor);
      this.bkdView.config.setRoiLineColor(roiLineColorHex);
    });
  }

  setRoiLineWidth(roiLineWidth: number): void {
    this._runWhenReady(() => { this.bkdView.config.setRoiLineWidth(roiLineWidth); });
  }

  setRoiOverlayBackgroundColor(roiOverlayBackgroundColor): void {
    this._runWhenReady(() => {
      const roiOberlayBackgroundColor = this.hexToAndroidColor(roiOverlayBackgroundColor);
      this.bkdView.config.setRoiOverlayBackgroundColor(roiOberlayBackgroundColor);
    });
  }

  setCloseSessionOnResultEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setCloseSessionOnResultEnabled(enabled); });
  }

  setImageResultEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setImageResultEnabled(enabled); });
  }

  setLocationInImageResultEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setLocationInImageResultEnabled(enabled); });
  }

  setLocationInPreviewEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setLocationInPreviewEnabled(enabled); });
  }

  setPinchToZoomEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setPinchToZoomEnabled(enabled); });
  }

  setRegionOfInterestVisible(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setRegionOfInterestVisible(enabled); });
  }

  configureFlashButton(
    visible: boolean,
    position: number[],
    iconSize: number,
    tintColor: string | Color | null,
    backgroundColor: string | Color | null,
    cornerRadius: number,
    padding: number,
    useCustomIcon: boolean,
    flashOnIconBase64: string,
    flashOffIconBase64: string
  ): void {
    this._runWhenReady(() => {
      let nativeTintColor: java.lang.Integer = null;
      if (tintColor != null) {
        const color = (tintColor instanceof Color) ? tintColor : new Color(tintColor as string);
        nativeTintColor = java.lang.Integer.valueOf(color.android);
      }
      let nativeBackgroundColor: java.lang.Integer = null;
      if (backgroundColor != null) {
        const color = (backgroundColor instanceof Color) ? backgroundColor : new Color(backgroundColor as string);
        nativeBackgroundColor = java.lang.Integer.valueOf(color.android);
      }
      const nativePosition = java.lang.reflect.Array.newInstance(java.lang.Float.TYPE, 2);
      nativePosition[0] = position[0];
      nativePosition[1] = position[1];
      let nativeFlashOnBitmap = null;
      let nativeFlashOffBitmap = null;
      if (useCustomIcon) {
        nativeFlashOnBitmap = this.decodeBase64ToBitmap(flashOnIconBase64);
        nativeFlashOffBitmap = this.decodeBase64ToBitmap(flashOffIconBase64);
      }
      this.bkdView.configureFlashButton(visible, nativePosition, iconSize, nativeTintColor, nativeBackgroundColor, cornerRadius, padding, useCustomIcon, nativeFlashOnBitmap, nativeFlashOffBitmap);
    });
  }

  configureCloseButton(
    visible: boolean, position: number[], iconSize: number,
    tintColor: string | Color | null, backgroundColor: string | Color | null,
    cornerRadius: number, padding: number, useCustomIcon: boolean,
    customIcon: string, onCloseCallback?: () => void
  ): void {
    this._runWhenReady(() => {
      let nativeTintColor: java.lang.Integer = null;
      if (tintColor != null) {
        const color = tintColor instanceof Color ? tintColor : new Color(tintColor as string);
        nativeTintColor = java.lang.Integer.valueOf(color.android);
      }
      let nativeBackgroundColor: java.lang.Integer = null;
      if (backgroundColor != null) {
        const color = backgroundColor instanceof Color ? backgroundColor : new Color(backgroundColor as string);
        nativeBackgroundColor = java.lang.Integer.valueOf(color.android);
      }
      const nativePosition = java.lang.reflect.Array.newInstance(java.lang.Float.TYPE, 2);
      nativePosition[0] = position[0];
      nativePosition[1] = position[1];
      let customIconBitmap = null;
      if (useCustomIcon && customIcon) {
        customIconBitmap = this.decodeBase64ToBitmap(customIcon);
      }
      const nativeCallback = onCloseCallback
        ? new java.lang.Runnable({ run: () => { onCloseCallback(); } })
        : null;
      this.bkdView.configureCloseButton(visible, nativePosition, iconSize, nativeTintColor, nativeBackgroundColor, cornerRadius, padding, useCustomIcon, customIconBitmap, nativeCallback);
    });
  }

  configureZoomButton(
    visible: boolean, position: number[], iconSize: number,
    tintColor: string | Color | null, backgroundColor: string | Color | null,
    cornerRadius: number, padding: number, useCustomIcon: boolean,
    zoomInIconBase64: string, zoomOutIconBase64: string,
    zoomedInFactor: number, zoomedOutFactor: number
  ): void {
    this._runWhenReady(() => {
      if (!global.isAndroid) return;
      let nativeTintColor: java.lang.Integer = null;
      if (tintColor != null) {
        const color = tintColor instanceof Color ? tintColor : new Color(tintColor as string);
        nativeTintColor = java.lang.Integer.valueOf(color.android);
      }
      let nativeBackgroundColor: java.lang.Integer = null;
      if (backgroundColor != null) {
        const color = backgroundColor instanceof Color ? backgroundColor : new Color(backgroundColor as string);
        nativeBackgroundColor = java.lang.Integer.valueOf(color.android);
      }
      const nativePosition = java.lang.reflect.Array.newInstance(java.lang.Float.TYPE, 2);
      nativePosition[0] = position[0];
      nativePosition[1] = position[1];
      let nativeZoomInBitmap = null;
      let nativeZoomOutBitmap = null;
      if (useCustomIcon && zoomInIconBase64 && zoomOutIconBase64) {
        nativeZoomInBitmap = this.decodeBase64ToBitmap(zoomInIconBase64);
        nativeZoomOutBitmap = this.decodeBase64ToBitmap(zoomOutIconBase64);
      }
      this.bkdView.configureZoomButton(visible, nativePosition, iconSize, nativeTintColor, nativeBackgroundColor, cornerRadius, padding, useCustomIcon, nativeZoomInBitmap, nativeZoomOutBitmap, zoomedInFactor, zoomedOutFactor);
    });
  }

  setRegionOfInterest(left: number, top: number, width: number, height: number): void {
    this._runWhenReady(() => { this.bkdView.config.setRegionOfInterest(left, top, width, height); });
  }

  setBeepOnSuccessEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setBeepOnSuccessEnabled(enabled); });
  }

  setVibrateOnSuccessEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setVibrateOnSuccessEnabled(enabled); });
  }

  getEncodingCharacterSet(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().encodingCharacterSet;
  }

  getDecodingSpeed(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().decodingSpeed;
  }

  getFormattingType(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().formattingType;
  }

  setLocationLineWidth(width: number): void {
    this._runWhenReady(() => {
      const roundedValue = Math.round(width * 100) / 100;
      this.bkdView.config.setLocationLineWidth(roundedValue);
    });
  }

  getLocationLineWidth(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getLocationLineWidth();
  }

  getRoiLineWidth(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getRoiLineWidth();
  }

  getRoiOverlayBackgroundColorHex(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getRoiOverlayBackgroundColor();
  }

  isCloseSessionOnResultEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isCloseSessionOnResultEnabled();
  }

  isImageResultEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isImageResultEnabled();
  }

  isLocationInImageResultEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isLocationInImageResultEnabled();
  }

  getRegionOfInterest(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getRegionOfInterest();
  }

  getThreadsLimit(): any {
    return this.bkdConfig.GetThreadsLimit();
  }

  setThreadsLimit(threadsLimit: number): void {
    this.bkdConfig.SetThreadsLimit(threadsLimit);
  }

  isLocationInPreviewEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isLocationInPreviewEnabled();
  }

  isPinchToZoomEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isPinchToZoomEnabled();
  }

  isRegionOfInterestVisible(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isRegionOfInterestVisible();
  }

  isBeepOnSuccessEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isBeepOnSuccessEnabled();
  }

  isVibrateOnSuccessEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isVibrateOnSuccessEnabled();
  }

  getVersion(): any {
    return com.barkoder.Barkoder.GetVersion();
  }

  getMsiCheckSumType(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().Msi.checksumType;
  }

  getCode39CheckSumType(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().Code39.checksumType;
  }

  getCode11CheckSumType(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().Code11.checksumType;
  }

  setBarkoderResolution(barkoderResolution: BarkoderConstants.BarkoderResolution): void {
    this._runWhenReady(() => {
      if (barkoderResolution == BarkoderConstants.BarkoderResolution.HD) {
        this.bkdView.config.setBarkoderResolution(com.barkoder.enums.BarkoderResolution.HD);
      } else if (barkoderResolution == BarkoderConstants.BarkoderResolution.FHD) {
        this.bkdView.config.setBarkoderResolution(com.barkoder.enums.BarkoderResolution.FHD);
      } else if (barkoderResolution == BarkoderConstants.BarkoderResolution.UHD) {
        this.bkdView.config.setBarkoderResolution(com.barkoder.enums.BarkoderResolution.UHD);
      }
    });
  }

  getBarkoderResolution(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getBarkoderResolution();
  }

  setEncodingCharacterSet(encodingCharSet: any): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().encodingCharacterSet = encodingCharSet; });
  }

  setDecodingSpeed(decodingSpeed: BarkoderConstants.DecodingSpeed): void {
    this._runWhenReady(() => {
      if (decodingSpeed == BarkoderConstants.DecodingSpeed.Slow) {
        this.bkdView.config.getDecoderConfig().decodingSpeed = com.barkoder.Barkoder.DecodingSpeed.Slow;
      } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Fast) {
        this.bkdView.config.getDecoderConfig().decodingSpeed = com.barkoder.Barkoder.DecodingSpeed.Fast;
      } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Normal) {
        this.bkdView.config.getDecoderConfig().decodingSpeed = com.barkoder.Barkoder.DecodingSpeed.Normal;
      } else if (decodingSpeed == BarkoderConstants.DecodingSpeed.Rigorous) {
        this.bkdView.config.getDecoderConfig().decodingSpeed = com.barkoder.Barkoder.DecodingSpeed.Rigorous;
      }
    });
  }

  setFormattingType(formattingType: BarkoderConstants.FormattingType) {
    this._runWhenReady(() => {
      switch (formattingType) {
        case BarkoderConstants.FormattingType.Disabled:
          this.bkdView.config.getDecoderConfig().formattingType = com.barkoder.Barkoder.FormattingType.Disabled;
          break;
        case BarkoderConstants.FormattingType.Automatic:
          this.bkdView.config.getDecoderConfig().formattingType = com.barkoder.Barkoder.FormattingType.Automatic;
          break;
        case BarkoderConstants.FormattingType.GS1:
          this.bkdView.config.getDecoderConfig().formattingType = com.barkoder.Barkoder.FormattingType.GS1;
          break;
        case BarkoderConstants.FormattingType.AAMVA:
          this.bkdView.config.getDecoderConfig().formattingType = com.barkoder.Barkoder.FormattingType.AAMVA;
          break;
        case BarkoderConstants.FormattingType.SADL:
          this.bkdView.config.getDecoderConfig().formattingType = com.barkoder.Barkoder.FormattingType.SADL;
          break;
        case BarkoderConstants.FormattingType.BCBP:
          this.bkdView.config.getDecoderConfig().formattingType = com.barkoder.Barkoder.FormattingType.BCBP;
          break;
      }
    });
  }

    forceCameraFps(fps: number): void {
    this._runWhenReady(() => {
      try {
        // Step 1: Get the cameraHandler field from BarkoderView
        let cameraHandlerField = null;
        let clazz = this.bkdView.getClass();

        // Walk up the class hierarchy to find the field
        while (clazz != null && cameraHandlerField == null) {
          try {
            cameraHandlerField = clazz.getDeclaredField("cameraHandler");
          } catch (e) {
            // Try common alternative field names
            try { cameraHandlerField = clazz.getDeclaredField("mCameraHandler"); } catch (e2) {}
            try { cameraHandlerField = clazz.getDeclaredField("cameraSource"); } catch (e3) {}
            try { cameraHandlerField = clazz.getDeclaredField("mCameraSource"); } catch (e4) {}
          }
          if (!cameraHandlerField) {
            clazz = clazz.getSuperclass();
          }
        }

        if (!cameraHandlerField) {
          // Dump all fields to find the right one
          console.log(">>> Could not find cameraHandler field. Dumping all fields:");
          let c = this.bkdView.getClass();
          while (c != null) {
            const fields = c.getDeclaredFields();
            for (let i = 0; i < fields.length; i++) {
              console.log(">>> Field:", fields[i].getName(), "Type:", fields[i].getType().getName());
            }
            c = c.getSuperclass();
            // Stop at Object
            if (c && c.getName() === "java.lang.Object") break;
          }
          return;
        }

        cameraHandlerField.setAccessible(true);
        const cameraHandler = cameraHandlerField.get(this.bkdView);
        console.log(">>> cameraHandler:", cameraHandler);

        if (!cameraHandler) {
          console.log(">>> cameraHandler is null - camera not started yet");
          return;
        }

        // Step 2: Call setRequestedFps on the camera handler
        try {
          cameraHandler.setRequestedFps(fps);
          console.log(">>> setRequestedFps(" + fps + ") SUCCESS");
          return;
        } catch (e) {
          console.log(">>> setRequestedFps failed, trying reflection on handler...");
        }

        // Step 3: If no public method, try to reach the CaptureRequest builder directly
        let builderField = null;
        let sessionField = null;
        let handlerClazz = cameraHandler.getClass();

        while (handlerClazz != null) {
          const fields = handlerClazz.getDeclaredFields();
          for (let i = 0; i < fields.length; i++) {
            const fname = fields[i].getName();
            const ftype = fields[i].getType().getName();
            console.log(">>> Handler field:", fname, "Type:", ftype);

            if (ftype.indexOf("CaptureRequest") !== -1 && ftype.indexOf("Builder") !== -1) {
              builderField = fields[i];
            }
            if (ftype.indexOf("CameraCaptureSession") !== -1) {
              sessionField = fields[i];
            }
          }
          handlerClazz = handlerClazz.getSuperclass();
          if (handlerClazz && handlerClazz.getName() === "java.lang.Object") break;
        }

        if (builderField && sessionField) {
          builderField.setAccessible(true);
          sessionField.setAccessible(true);

          const builder = builderField.get(cameraHandler);
          const session = sessionField.get(cameraHandler);

          if (builder && session) {
            // Set AE target FPS range to [fps, fps]
            const range = new android.util.Range(
              java.lang.Integer.valueOf(fps),
              java.lang.Integer.valueOf(fps)
            );

            builder.set(
              android.hardware.camera2.CaptureRequest.CONTROL_AE_TARGET_FPS_RANGE,
              range
            );
            builder.set(
              android.hardware.camera2.CaptureRequest.CONTROL_AE_MODE,
              java.lang.Integer.valueOf(android.hardware.camera2.CaptureRequest.CONTROL_AE_MODE_ON)
            );

            session.setRepeatingRequest(builder.build(), null, null);
            console.log(">>> Manually set camera FPS to", fps, "SUCCESS");
          }
        }
      } catch (e) {
        console.log(">>> forceCameraFps error:", e);
      }
    });
  }

  setMsiCheckSumType(msiCheckSumType: BarkoderConstants.MsiChecksumType) {
    this._runWhenReady(() => {
      switch (msiCheckSumType) {
        case BarkoderConstants.MsiChecksumType.Disabled:
          this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Disabled; break;
        case BarkoderConstants.MsiChecksumType.Mod10:
          this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod10; break;
        case BarkoderConstants.MsiChecksumType.Mod11:
          this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod11; break;
        case BarkoderConstants.MsiChecksumType.Mod1010:
          this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod1010; break;
        case BarkoderConstants.MsiChecksumType.Mod1110:
          this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod1110; break;
        case BarkoderConstants.MsiChecksumType.Mod11IBM:
          this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod11IBM; break;
        case BarkoderConstants.MsiChecksumType.Mod1110IBM:
          this.bkdView.config.getDecoderConfig().Msi.checksumType = com.barkoder.Barkoder.MsiChecksumType.Mod1110IBM; break;
      }
    });
  }

  setCode39CheckSumType(code39ChecksumType: BarkoderConstants.Code39ChecksumType) {
    this._runWhenReady(() => {
      switch (code39ChecksumType) {
        case BarkoderConstants.Code39ChecksumType.Disabled:
          this.bkdView.config.getDecoderConfig().Code39.checksumType = com.barkoder.Barkoder.Code39ChecksumType.Disabled; break;
        case BarkoderConstants.Code39ChecksumType.Enabled:
          this.bkdView.config.getDecoderConfig().Code39.checksumType = com.barkoder.Barkoder.Code39ChecksumType.Enabled; break;
      }
    });
  }

  setCode11CheckSumType(code11CheckSumType: BarkoderConstants.Code11ChecksumType) {
    this._runWhenReady(() => {
      switch (code11CheckSumType) {
        case BarkoderConstants.Code11ChecksumType.Disabled:
          this.bkdView.config.getDecoderConfig().Code11.checksumType = com.barkoder.Barkoder.Code11ChecksumType.Disabled; break;
        case BarkoderConstants.Code11ChecksumType.Single:
          this.bkdView.config.getDecoderConfig().Code11.checksumType = com.barkoder.Barkoder.Code11ChecksumType.Single; break;
        case BarkoderConstants.Code11ChecksumType.Double:
          this.bkdView.config.getDecoderConfig().Code11.checksumType = com.barkoder.Barkoder.Code11ChecksumType.Double; break;
      }
    });
  }

  isBarcodeTypeEnabled(decoder: BarkoderConstants.DecoderType): boolean {
    if (!this.bkdView) return false;
    // ...existing switch logic unchanged...
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
      case BarkoderConstants.DecoderType.Databar14:
        return this.bkdView.config.getDecoderConfig().Databar14.enabled;
      case BarkoderConstants.DecoderType.DatabarLimited:
        return this.bkdView.config.getDecoderConfig().DatabarLimited.enabled;
      case BarkoderConstants.DecoderType.DatabarExpanded:
        return this.bkdView.config.getDecoderConfig().DatabarExpanded.enabled;
      case BarkoderConstants.DecoderType.PostalIMB:
        return this.bkdView.config.getDecoderConfig().PostalIMB.enabled;
      case BarkoderConstants.DecoderType.Planet:
        return this.bkdView.config.getDecoderConfig().Planet.enabled;
      case BarkoderConstants.DecoderType.Postnet:
        return this.bkdView.config.getDecoderConfig().Postnet.enabled;
      case BarkoderConstants.DecoderType.AustralianPost:
        return this.bkdView.config.getDecoderConfig().AustralianPost.enabled;
      case BarkoderConstants.DecoderType.RoyalMail:
        return this.bkdView.config.getDecoderConfig().RoyalMail.enabled;
      case BarkoderConstants.DecoderType.KIX:
        return this.bkdView.config.getDecoderConfig().KIX.enabled;
      case BarkoderConstants.DecoderType.JapanesePost:
        return this.bkdView.config.getDecoderConfig().JapanesePost.enabled;
      case BarkoderConstants.DecoderType.MaxiCode:
        return this.bkdView.config.getDecoderConfig().MaxiCode.enabled;
      case BarkoderConstants.DecoderType.OCRText:
        return this.bkdView.config.getDecoderConfig().OCRText.enabled;
    }
  }

  setBarcodeTypeEnabled(decoders: BarkoderConstants.DecoderType[]): void {
    this._runWhenReady(() => {
      // ...existing code for disabling all decoders and enabling selected ones...
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
      this.bkdView.config.getDecoderConfig().Databar14.enabled = false;
      this.bkdView.config.getDecoderConfig().DatabarLimited.enabled = false;
      this.bkdView.config.getDecoderConfig().DatabarExpanded.enabled = false;
      this.bkdView.config.getDecoderConfig().PostalIMB.enabled = false;
      this.bkdView.config.getDecoderConfig().Postnet.enabled = false;
      this.bkdView.config.getDecoderConfig().Planet.enabled = false;
      this.bkdView.config.getDecoderConfig().AustralianPost.enabled = false;
      this.bkdView.config.getDecoderConfig().RoyalMail.enabled = false;
      this.bkdView.config.getDecoderConfig().KIX.enabled = false;
      this.bkdView.config.getDecoderConfig().JapanesePost.enabled = false;
      this.bkdView.config.getDecoderConfig().MaxiCode.enabled = false;
      this.bkdView.config.getDecoderConfig().OCRText.enabled = false;
      decoders.forEach((dt: BarkoderConstants.DecoderType) => {
        switch (dt) {
          case BarkoderConstants.DecoderType.Aztec: this.bkdView.config.getDecoderConfig().Aztec.enabled = true; break;
          case BarkoderConstants.DecoderType.AztecCompact: this.bkdView.config.getDecoderConfig().AztecCompact.enabled = true; break;
          case BarkoderConstants.DecoderType.QR: this.bkdView.config.getDecoderConfig().QR.enabled = true; break;
          case BarkoderConstants.DecoderType.QRMicro: this.bkdView.config.getDecoderConfig().QRMicro.enabled = true; break;
          case BarkoderConstants.DecoderType.Code128: this.bkdView.config.getDecoderConfig().Code128.enabled = true; break;
          case BarkoderConstants.DecoderType.Code93: this.bkdView.config.getDecoderConfig().Code93.enabled = true; break;
          case BarkoderConstants.DecoderType.Code39: this.bkdView.config.getDecoderConfig().Code39.enabled = true; break;
          case BarkoderConstants.DecoderType.Telepen: this.bkdView.config.getDecoderConfig().Telepen.enabled = true; break;
          case BarkoderConstants.DecoderType.Code11: this.bkdView.config.getDecoderConfig().Code11.enabled = true; break;
          case BarkoderConstants.DecoderType.Msi: this.bkdView.config.getDecoderConfig().Msi.enabled = true; break;
          case BarkoderConstants.DecoderType.UpcA: this.bkdView.config.getDecoderConfig().UpcA.enabled = true; break;
          case BarkoderConstants.DecoderType.UpcE: this.bkdView.config.getDecoderConfig().UpcE.enabled = true; break;
          case BarkoderConstants.DecoderType.UpcE1: this.bkdView.config.getDecoderConfig().UpcE1.enabled = true; break;
          case BarkoderConstants.DecoderType.Ean13: this.bkdView.config.getDecoderConfig().Ean13.enabled = true; break;
          case BarkoderConstants.DecoderType.Ean8: this.bkdView.config.getDecoderConfig().Ean8.enabled = true; break;
          case BarkoderConstants.DecoderType.PDF417: this.bkdView.config.getDecoderConfig().PDF417.enabled = true; break;
          case BarkoderConstants.DecoderType.PDF417Micro: this.bkdView.config.getDecoderConfig().PDF417Micro.enabled = true; break;
          case BarkoderConstants.DecoderType.Datamatrix: this.bkdView.config.getDecoderConfig().Datamatrix.enabled = true; break;
          case BarkoderConstants.DecoderType.Code25: this.bkdView.config.getDecoderConfig().Code25.enabled = true; break;
          case BarkoderConstants.DecoderType.Interleaved25: this.bkdView.config.getDecoderConfig().Interleaved25.enabled = true; break;
          case BarkoderConstants.DecoderType.ITF14: this.bkdView.config.getDecoderConfig().ITF14.enabled = true; break;
          case BarkoderConstants.DecoderType.IATA25: this.bkdView.config.getDecoderConfig().IATA25.enabled = true; break;
          case BarkoderConstants.DecoderType.Matrix25: this.bkdView.config.getDecoderConfig().Matrix25.enabled = true; break;
          case BarkoderConstants.DecoderType.Datalogic25: this.bkdView.config.getDecoderConfig().Datalogic25.enabled = true; break;
          case BarkoderConstants.DecoderType.COOP25: this.bkdView.config.getDecoderConfig().COOP25.enabled = true; break;
          case BarkoderConstants.DecoderType.Dotcode: this.bkdView.config.getDecoderConfig().Dotcode.enabled = true; break;
          case BarkoderConstants.DecoderType.IDDocument: this.bkdView.config.getDecoderConfig().IDDocument.enabled = true; break;
          case BarkoderConstants.DecoderType.Codabar: this.bkdView.config.getDecoderConfig().Codabar.enabled = true; break;
          case BarkoderConstants.DecoderType.Databar14: this.bkdView.config.getDecoderConfig().Databar14.enabled = true; break;
          case BarkoderConstants.DecoderType.DatabarExpanded: this.bkdView.config.getDecoderConfig().DatabarExpanded.enabled = true; break;
          case BarkoderConstants.DecoderType.DatabarLimited: this.bkdView.config.getDecoderConfig().DatabarLimited.enabled = true; break;
          case BarkoderConstants.DecoderType.PostalIMB: this.bkdView.config.getDecoderConfig().PostalIMB.enabled = true; break;
          case BarkoderConstants.DecoderType.Postnet: this.bkdView.config.getDecoderConfig().Postnet.enabled = true; break;
          case BarkoderConstants.DecoderType.Planet: this.bkdView.config.getDecoderConfig().Planet.enabled = true; break;
          case BarkoderConstants.DecoderType.AustralianPost: this.bkdView.config.getDecoderConfig().AustralianPost.enabled = true; break;
          case BarkoderConstants.DecoderType.RoyalMail: this.bkdView.config.getDecoderConfig().RoyalMail.enabled = true; break;
          case BarkoderConstants.DecoderType.KIX: this.bkdView.config.getDecoderConfig().KIX.enabled = true; break;
          case BarkoderConstants.DecoderType.JapanesePost: this.bkdView.config.getDecoderConfig().JapanesePost.enabled = true; break;
          case BarkoderConstants.DecoderType.MaxiCode: this.bkdView.config.getDecoderConfig().MaxiCode.enabled = true; break;
          case BarkoderConstants.DecoderType.OCRText: this.bkdView.config.getDecoderConfig().OCRText.enabled = true; break;
          default: break;
        }
      });
    });
  }

  setBarcodeTypeLengthRange(decoder: BarkoderConstants.DecoderType, minimumLength: number, maximumLength: number) {
    this._runWhenReady(() => {
      // ...existing switch logic unchanged...
      switch (decoder) {
        case BarkoderConstants.DecoderType.Aztec:
          this.bkdView.config.getDecoderConfig().Aztec.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Aztec.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.AztecCompact:
          this.bkdView.config.getDecoderConfig().AztecCompact.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().AztecCompact.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.QR:
          this.bkdView.config.getDecoderConfig().QR.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().QR.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.QRMicro:
          this.bkdView.config.getDecoderConfig().QRMicro.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().QRMicro.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Code128:
          this.bkdView.config.getDecoderConfig().Code128.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Code128.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Code93:
          this.bkdView.config.getDecoderConfig().Code93.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Code93.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Code39:
          this.bkdView.config.getDecoderConfig().Code39.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Code39.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Telepen:
          this.bkdView.config.getDecoderConfig().Telepen.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Telepen.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Code11:
          this.bkdView.config.getDecoderConfig().Code11.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Code11.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Msi:
          this.bkdView.config.getDecoderConfig().Msi.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Msi.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.UpcA:
          this.bkdView.config.getDecoderConfig().UpcA.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().UpcA.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.UpcE:
          this.bkdView.config.getDecoderConfig().UpcE.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().UpcE.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.UpcE1:
          this.bkdView.config.getDecoderConfig().UpcE1.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().UpcE1.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Ean13:
          this.bkdView.config.getDecoderConfig().Ean13.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Ean13.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Ean8:
          this.bkdView.config.getDecoderConfig().Ean8.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Ean8.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.PDF417:
          this.bkdView.config.getDecoderConfig().PDF417.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().PDF417.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.PDF417Micro:
          this.bkdView.config.getDecoderConfig().PDF417Micro.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().PDF417Micro.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Datamatrix:
          this.bkdView.config.getDecoderConfig().Datamatrix.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Datamatrix.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Code25:
          this.bkdView.config.getDecoderConfig().Code25.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Code25.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Interleaved25:
          this.bkdView.config.getDecoderConfig().Interleaved25.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Interleaved25.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.ITF14:
          this.bkdView.config.getDecoderConfig().ITF14.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().ITF14.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.IATA25:
          this.bkdView.config.getDecoderConfig().IATA25.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().IATA25.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Matrix25:
          this.bkdView.config.getDecoderConfig().Matrix25.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Matrix25.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Datalogic25:
          this.bkdView.config.getDecoderConfig().Datalogic25.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Datalogic25.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.COOP25:
          this.bkdView.config.getDecoderConfig().COOP25.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().COOP25.maximumLength = maximumLength; break;
        case BarkoderConstants.DecoderType.Dotcode:
          this.bkdView.config.getDecoderConfig().Dotcode.minimumLength = minimumLength;
          this.bkdView.config.getDecoderConfig().Dotcode.maximumLength = maximumLength; break;
        default: break;
      }
    });
  }

  getBarcodeTypeMaximumLenght(decoder: BarkoderConstants.DecoderType): any {
    if (!this.bkdView) return null;
    // ...existing switch logic unchanged...
    switch (decoder) {
      case BarkoderConstants.DecoderType.Aztec: return this.bkdView.config.getDecoderConfig().Aztec.maximumLength;
      case BarkoderConstants.DecoderType.AztecCompact: return this.bkdView.config.getDecoderConfig().AztecCompact.maximumLength;
      case BarkoderConstants.DecoderType.QR: return this.bkdView.config.getDecoderConfig().QR.maximumLength;
      case BarkoderConstants.DecoderType.QRMicro: return this.bkdView.config.getDecoderConfig().QRMicro.maximumLength;
      case BarkoderConstants.DecoderType.Code128: return this.bkdView.config.getDecoderConfig().Code128.maximumLength;
      case BarkoderConstants.DecoderType.Code93: return this.bkdView.config.getDecoderConfig().Code93.maximumLength;
      case BarkoderConstants.DecoderType.Code39: return this.bkdView.config.getDecoderConfig().Code39.maximumLength;
      case BarkoderConstants.DecoderType.Telepen: return this.bkdView.config.getDecoderConfig().Telepen.maximumLength;
      case BarkoderConstants.DecoderType.Code11: return this.bkdView.config.getDecoderConfig().Code11.maximumLength;
      case BarkoderConstants.DecoderType.Msi: return this.bkdView.config.getDecoderConfig().Msi.maximumLength;
      case BarkoderConstants.DecoderType.UpcA: return this.bkdView.config.getDecoderConfig().UpcA.maximumLength;
      case BarkoderConstants.DecoderType.UpcE: return this.bkdView.config.getDecoderConfig().UpcE.maximumLength;
      case BarkoderConstants.DecoderType.UpcE1: return this.bkdView.config.getDecoderConfig().UpcE1.maximumLength;
      case BarkoderConstants.DecoderType.Ean13: return this.bkdView.config.getDecoderConfig().Ean13.maximumLength;
      case BarkoderConstants.DecoderType.Ean8: return this.bkdView.config.getDecoderConfig().Ean8.maximumLength;
      case BarkoderConstants.DecoderType.PDF417: return this.bkdView.config.getDecoderConfig().PDF417.maximumLength;
      case BarkoderConstants.DecoderType.PDF417Micro: return this.bkdView.config.getDecoderConfig().PDF417Micro.maximumLength;
      case BarkoderConstants.DecoderType.Datamatrix: return this.bkdView.config.getDecoderConfig().Datamatrix.maximumLength;
      case BarkoderConstants.DecoderType.Code25: return this.bkdView.config.getDecoderConfig().Code25.maximumLength;
      case BarkoderConstants.DecoderType.Interleaved25: return this.bkdView.config.getDecoderConfig().Interleaved25.maximumLength;
      case BarkoderConstants.DecoderType.ITF14: return this.bkdView.config.getDecoderConfig().ITF14.maximumLength;
      case BarkoderConstants.DecoderType.IATA25: return this.bkdView.config.getDecoderConfig().IATA25.maximumLength;
      case BarkoderConstants.DecoderType.Matrix25: return this.bkdView.config.getDecoderConfig().Matrix25.maximumLength;
      case BarkoderConstants.DecoderType.Datalogic25: return this.bkdView.config.getDecoderConfig().Datalogic25.maximumLength;
      case BarkoderConstants.DecoderType.COOP25: return this.bkdView.config.getDecoderConfig().COOP25.maximumLength;
      case BarkoderConstants.DecoderType.Dotcode: return this.bkdView.config.getDecoderConfig().Dotcode.maximumLength;
    }
  }

  getBarcodeTypeMinimumLenght(decoder: BarkoderConstants.DecoderType): any {
    if (!this.bkdView) return null;
    // ...existing switch logic unchanged...
    switch (decoder) {
      case BarkoderConstants.DecoderType.Aztec: return this.bkdView.config.getDecoderConfig().Aztec.minimumLength;
      case BarkoderConstants.DecoderType.AztecCompact: return this.bkdView.config.getDecoderConfig().AztecCompact.minimumLength;
      case BarkoderConstants.DecoderType.QR: return this.bkdView.config.getDecoderConfig().QR.minimumLength;
      case BarkoderConstants.DecoderType.QRMicro: return this.bkdView.config.getDecoderConfig().QRMicro.minimumLength;
      case BarkoderConstants.DecoderType.Code128: return this.bkdView.config.getDecoderConfig().Code128.minimumLength;
      case BarkoderConstants.DecoderType.Code93: return this.bkdView.config.getDecoderConfig().Code93.minimumLength;
      case BarkoderConstants.DecoderType.Code39: return this.bkdView.config.getDecoderConfig().Code39.minimumLength;
      case BarkoderConstants.DecoderType.Telepen: return this.bkdView.config.getDecoderConfig().Telepen.minimumLength;
      case BarkoderConstants.DecoderType.Code11: return this.bkdView.config.getDecoderConfig().Code11.minimumLength;
      case BarkoderConstants.DecoderType.Msi: return this.bkdView.config.getDecoderConfig().Msi.minimumLength;
      case BarkoderConstants.DecoderType.UpcA: return this.bkdView.config.getDecoderConfig().UpcA.minimumLength;
      case BarkoderConstants.DecoderType.UpcE: return this.bkdView.config.getDecoderConfig().UpcE.minimumLength;
      case BarkoderConstants.DecoderType.UpcE1: return this.bkdView.config.getDecoderConfig().UpcE1.minimumLength;
      case BarkoderConstants.DecoderType.Ean13: return this.bkdView.config.getDecoderConfig().Ean13.minimumLength;
      case BarkoderConstants.DecoderType.Ean8: return this.bkdView.config.getDecoderConfig().Ean8.minimumLength;
      case BarkoderConstants.DecoderType.PDF417: return this.bkdView.config.getDecoderConfig().PDF417.minimumLength;
      case BarkoderConstants.DecoderType.PDF417Micro: return this.bkdView.config.getDecoderConfig().PDF417Micro.minimumLength;
      case BarkoderConstants.DecoderType.Datamatrix: return this.bkdView.config.getDecoderConfig().Datamatrix.minimumLength;
      case BarkoderConstants.DecoderType.Code25: return this.bkdView.config.getDecoderConfig().Code25.minimumLength;
      case BarkoderConstants.DecoderType.Interleaved25: return this.bkdView.config.getDecoderConfig().Interleaved25.minimumLength;
      case BarkoderConstants.DecoderType.ITF14: return this.bkdView.config.getDecoderConfig().ITF14.minimumLength;
      case BarkoderConstants.DecoderType.IATA25: return this.bkdView.config.getDecoderConfig().IATA25.minimumLength;
      case BarkoderConstants.DecoderType.Matrix25: return this.bkdView.config.getDecoderConfig().Matrix25.minimumLength;
      case BarkoderConstants.DecoderType.Datalogic25: return this.bkdView.config.getDecoderConfig().Datalogic25.minimumLength;
      case BarkoderConstants.DecoderType.COOP25: return this.bkdView.config.getDecoderConfig().COOP25.minimumLength;
      case BarkoderConstants.DecoderType.Dotcode: return this.bkdView.config.getDecoderConfig().Dotcode.minimumLength;
    }
  }

  setMaximumResultsCount(maximumResultsCount: number): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().maximumResultsCount = maximumResultsCount; });
  }

  setARResultLimit(resultLimit: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.resultLimit = resultLimit; });
  }

  setDuplicatesDelayMs(duplicateDelayMs: number): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().duplicatesDelayMs = duplicateDelayMs; });
  }

  getSadlImageFromExtra(extra: any): ImageSource | null {
    if (!extra || !global.isAndroid) return null;
    try {
      const bitmap = com.barkoder.BarkoderHelper.sadlImage(extra);
      if (!bitmap) return null;
      const imageSource = new ImageSource();
      imageSource.setNativeSource(bitmap);
      return imageSource;
    } catch (e) {
      console.error('Failed to extract SADL image:', e);
      return null;
    }
  }

  setMulticodeCachingDuration(multicodeCachingDuration: number): void {
    this.bkdConfig.SetMulticodeCachingDuration(multicodeCachingDuration);
  }

  setMulticodeCachingEnabled(multiCodeCachingEnabled: boolean): void {
    this.bkdConfig.SetMulticodeCachingEnabled(multiCodeCachingEnabled);
  }

  getMaximumResultsCount(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().maximumResultsCount;
  }

  getDuplicatesDelayMs(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().duplicatesDelayMs;
  }

  setARImageResultEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.imageResultEnabled = enabled; });
  }

  setARBarcodeThumbnailOnResultEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.barcodeThumbnailOnResult = enabled; });
  }

  isARImageResultEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.imageResultEnabled;
  }

  isARBarcodeThumbnailOnResultEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.barcodeThumbnailOnResult;
  }

  getCurrentZoomFactor(): any {
    if (!this.bkdView) return null;
    return this.bkdView.getCurrentZoomFactor();
  }

  setDatamatrixDpmModeEnabled(dpmModeEnabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().Datamatrix.dpmMode = dpmModeEnabled; });
  }

  setQRDpmModeEnabled(dpmModeEnabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().QR.dpmMode = dpmModeEnabled; });
  }

  setQRMicroDpmModeEnabled(dpmModeEnabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().QRMicro.dpmMode = dpmModeEnabled; });
  }

  isDatamatrixDpmModeEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().Datamatrix.dpmMode;
  }

  isQRDpmModeEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().QR.dpmMode;
  }

  isQRMicroDpmModeEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().QRMicro.dpmMode;
  }

  setUpcEanDeblurEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().upcEanDeblur = enabled; });
  }

  setEnableMisshaped1DEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().enableMisshaped1D = enabled; });
  }

  setBarcodeThumbnailOnResultEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setThumbnailOnResultEnabled(enabled); });
  }

  isBarcodeThumbnailOnResultEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getThumbnailOnResulEnabled();
  }

  getPowerSavingMode(): number {
    if (!this.bkdView) return null;
    return this.bkdView.config.getPowerSavingMode();
  }

 setPowerSavingMode(mode: number): void {
    this._runWhenReady(() => {
      // Call on bkdView (which has the cameraHandler), NOT on bkdView.config
      this.bkdView.config.setPowerSavingMode(mode);
    });
  }

  setThresholdBetweenDuplicatesScans(thresholdBetweenDuplicatesScans: number): void {
    this._runWhenReady(() => { this.bkdView.config.setThresholdBetweenDuplicatesScans(thresholdBetweenDuplicatesScans); });
  }

  getThresholdBetweenDuplicatesScans(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getThresholdBetweenDuplicatesScans();
  }

  getMulticodeCachingEnabled(): any {
    return this.bkdConfig.IsMulticodeCachingEnabled();
  }

  getMulticodeCachingDuration(): any {
    return this.bkdConfig.GetMulticodeCachingDuration();
  }

  isUpcEanDeblurEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().upcEanDeblur;
  }

  isMisshaped1DEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().enableMisshaped1D;
  }

  isVINRestrictionsEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().enableVINRestrictions;
  }

  setEnableVINRestrictions(vinRestrictionsEnabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().enableVINRestrictions = vinRestrictionsEnabled; });
  }

  isEnabledComposite(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().enableComposite;
  }

  setEnabledComposite(enableComposited: number): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().enableComposite = enableComposited; });
  }

  setScanningIndicatorColor(scanningIndicatorColor: string): void {
    this._runWhenReady(() => {
      const scanningIndicatorColorHex = this.hexToAndroidColor(scanningIndicatorColor);
      this.bkdView.config.setScanningIndicatorColor(scanningIndicatorColorHex);
    });
  }

  getScanningIndicatorColorHex(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getScanningIndicatorColor();
  }

  setScanningIndicatorWidth(scanningIndicatorWidth: number): void {
    this._runWhenReady(() => { this.bkdView.config.setScanningIndicatorWidth(scanningIndicatorWidth); });
  }

  getScanningIndicatorWidth(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getScanningIndicatorWidth();
  }

  setScanningIndicatorAnimation(indicatorMode: number): void {
    this._runWhenReady(() => { this.bkdView.config.setScanningIndicatorAnimation(indicatorMode); });
  }

  getScanningIndicatorAnimation(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getScanningIndicatorAnimation();
  }

  setScanningIndicatorAlwaysVisible(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.setScanningIndicatorAlwaysVisible(enabled); });
  }

  isScanningIndicatorAlwaysVisible(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.isScanningIndicatorAlwaysVisible();
  }

  setUPCEexpandToUPCA(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().UpcE.expandToUPCA = enabled; });
  }

  setUPCE1expandToUPCA(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().UpcE1.expandToUPCA = enabled; });
  }

  setCustomOption(string: string, mode: number): void {
    this._runWhenReady(() => {
      com.barkoder.Barkoder.SetCustomOption(this.bkdView.config.getDecoderConfig(), string, mode);
    });
  }

  setCustomOptionGlobal(string: string, mode: number): void {
    com.barkoder.Barkoder.SetCustomOptionGlobal(string, mode);
  }

  setDynamicExposure(mode: number): void {
    this._runWhenReady(() => { this.bkdView.setDynamicExposure(mode); });
  }

  setCentricFocusAndExposure(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.setCentricFocusAndExposure(enabled); });
  }

  setVideoStabilization(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.setVideoStabilization(enabled); });
  }

  setCamera(cameraPosition: BarkoderConstants.BarkoderCameraPosition): void {
    this._runWhenReady(() => {
      if (cameraPosition == BarkoderConstants.BarkoderCameraPosition.Front) {
        this.bkdView.setCamera(com.barkoder.enums.BarkoderCameraPosition.FRONT);
      } else if (cameraPosition == BarkoderConstants.BarkoderCameraPosition.Back) {
        this.bkdView.setCamera(com.barkoder.enums.BarkoderCameraPosition.BACK);
      }
    });
  }

  setBarkoderARMode(arMode: BarkoderConstants.BarkoderARMode): void {
    this._runWhenReady(() => {
      if (arMode == BarkoderConstants.BarkoderARMode.OFF) {
        this.bkdView.config.arConfig.arMode = com.barkoder.enums.BarkoderARMode.OFF;
      } else if (arMode == BarkoderConstants.BarkoderARMode.InteractiveDisabled) {
        this.bkdView.config.arConfig.arMode = com.barkoder.enums.BarkoderARMode.InteractiveDisabled;
      } else if (arMode == BarkoderConstants.BarkoderARMode.InteractiveEnabled) {
        this.bkdView.config.arConfig.arMode = com.barkoder.enums.BarkoderARMode.InteractiveEnabled;
      } else if (arMode == BarkoderConstants.BarkoderARMode.NonInteractive) {
        this.bkdView.config.arConfig.arMode = com.barkoder.enums.BarkoderARMode.NonInteractive;
      } else if (arMode == BarkoderConstants.BarkoderARMode.MatchFilter) {
        this.bkdView.config.arConfig.arMode = com.barkoder.enums.BarkoderARMode.MatchFilter;
      }
    });
  }

  getBarkoderARMode(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.arMode;
  }

  setBarkoderARLocationType(locationType: BarkoderConstants.BarkoderARLocationType): void {
    this._runWhenReady(() => {
      if (locationType == BarkoderConstants.BarkoderARLocationType.NONE) {
        this.bkdView.config.arConfig.locationType = com.barkoder.enums.BarkoderARLocationType.NONE;
      } else if (locationType == BarkoderConstants.BarkoderARLocationType.TIGHT) {
        this.bkdView.config.arConfig.locationType = com.barkoder.enums.BarkoderARLocationType.TIGHT;
      } else if (locationType == BarkoderConstants.BarkoderARLocationType.BOUNDINGBOX) {
        this.bkdView.config.arConfig.locationType = com.barkoder.enums.BarkoderARLocationType.BOUNDINGBOX;
      }
    });
  }

  getBarkoderARLocationType(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.locationType;
  }

  setBarkoderARHeaderShowMode(headerShowMode: BarkoderConstants.BarkoderARHeaderShowMode): void {
    this._runWhenReady(() => {
      if (headerShowMode == BarkoderConstants.BarkoderARHeaderShowMode.NEVER) {
        this.bkdView.config.arConfig.headerShowMode = com.barkoder.enums.BarkoderARHeaderShowMode.NEVER;
      } else if (headerShowMode == BarkoderConstants.BarkoderARHeaderShowMode.ONSELECTED) {
        this.bkdView.config.arConfig.headerShowMode = com.barkoder.enums.BarkoderARHeaderShowMode.ONSELECTED;
      } else if (headerShowMode == BarkoderConstants.BarkoderARHeaderShowMode.ALWAYS) {
        this.bkdView.config.arConfig.headerShowMode = com.barkoder.enums.BarkoderARHeaderShowMode.ALWAYS;
      }
    });
  }

  getBarkoderARHeaderShowMode(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.headerShowMode;
  }

  setBarkoderARoverlayRefresh(overlayRefresh: BarkoderConstants.BarkoderAROverlayRefresh): void {
    this._runWhenReady(() => {
      if (overlayRefresh == BarkoderConstants.BarkoderAROverlayRefresh.SMOOTH) {
        this.bkdView.config.arConfig.overlayRefresh = com.barkoder.enums.BarkoderAROverlayRefresh.SMOOTH;
      } else if (overlayRefresh == BarkoderConstants.BarkoderAROverlayRefresh.NORMAL) {
        this.bkdView.config.arConfig.overlayRefresh = com.barkoder.enums.BarkoderAROverlayRefresh.NORMAL;
      }
    });
  }

  getBarkoderARoverlayRefresh(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.overlayRefresh;
  }

  setARNonSelectedLocationLineColor(locationLineColor: string): void {
    this._runWhenReady(() => {
      const locationColor = this.hexToAndroidColor(locationLineColor);
      this.bkdView.config.arConfig.setNonSelectedLocationColor(locationColor);
    });
  }

  getARNonSelectedLocationLineColor(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getNonSelectedLocationColor();
  }

  setARSelectedLocationLineColor(locationLineColor: string): void {
    this._runWhenReady(() => {
      const locationColor = this.hexToAndroidColor(locationLineColor);
      this.bkdView.config.arConfig.setSelectedLocationColor(locationColor);
    });
  }

  getARSelectedLocationLineColor(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getSelectedLocationColor();
  }

  setARHeaderMaxTextHeight(maxText: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setHeaderMaxTextHeight(maxText); });
  }

  getARHeaderMaxTextHeight(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getHeaderMaxTextHeight();
  }

  setARHeaderMinTextHeight(maxText: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setHeaderMinTextHeight(maxText); });
  }

  getARHeaderMinTextHeight(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getHeaderMinTextHeight();
  }

  setARHeaderHeight(height: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setHeaderHeight(height); });
  }

  getARHeaderHeight(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getHeaderHeight();
  }

  setARHeaderVerticalTextMargin(margin: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setHeaderVerticalTextMargin(margin); });
  }

  getARHeaderVerticalTextMargin(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getHeaderVerticalTextMargin();
  }

  setARHeaderHorizontalTextMargin(margin: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setHeaderHorizontalTextMargin(margin); });
  }

  getARHeaderHorizontalTextMargin(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getHeaderHorizontalTextMargin();
  }

  setARNonSelectedHeaderTextColor(locationLineColor: string): void {
    this._runWhenReady(() => {
      const locationColor = this.hexToAndroidColor(locationLineColor);
      this.bkdView.config.arConfig.setHeaderTextColorNonSelected(locationColor);
    });
  }

  getARNonSelectedHeaderTextColor(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getHeaderTextColorNonSelected();
  }

  setARSelectedHeaderTextColor(locationLineColor: string): void {
    this._runWhenReady(() => {
      const locationColor = this.hexToAndroidColor(locationLineColor);
      this.bkdView.config.arConfig.setHeaderTextColorSelected(locationColor);
    });
  }

  getARSelectedHeaderTextColor(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getHeaderTextColorSelected();
  }

  setARDoubleTapToFreezeEnabled(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setDoubleTapToFreezeEnabled(enabled); });
  }

  debugUnfreeze(): void {
    this._runWhenReady(() => {
      try {
        console.log(">>> ========= UNFREEZE DEBUG =========");

        // Call native unfreeze first
        this.bkdView.unfreezeScanning();
        console.log(">>> unfreezeScanning called, state:", this.bkdView.getBarkoderState());

        // Now find and remove any frozen ImageView overlays
        const childCount = this.bkdView.getChildCount();
        console.log(">>> bkdView child count:", childCount);

        for (let i = childCount - 1; i >= 0; i--) {
          const child = this.bkdView.getChildAt(i);
          const className = child.getClass().getName();
          console.log(">>> Child[" + i + "]:", className);

          // Check if it's an ImageView (the frozen overlay)
          if (child instanceof android.widget.ImageView) {
            console.log(">>> Found ImageView at index", i, "visibility:", child.getVisibility());
            
            // Option 1: Hide it
            child.setVisibility(android.view.View.GONE);
            console.log(">>> Set ImageView to GONE");

            // Option 2: Remove it entirely
            // this.bkdView.removeViewAt(i);
            // console.log(">>> Removed ImageView");
          }
        }

        // Also check deeper - the frozen view might be nested
        for (let i = 0; i < this.bkdView.getChildCount(); i++) {
          const child = this.bkdView.getChildAt(i);
          if (child.getChildCount) {
            try {
              const grandChildCount = child.getChildCount();
              for (let j = grandChildCount - 1; j >= 0; j--) {
                const grandChild = child.getChildAt(j);
                if (grandChild instanceof android.widget.ImageView) {
                  console.log(">>> Found nested ImageView at [" + i + "][" + j + "] vis:", grandChild.getVisibility());
                  grandChild.setVisibility(android.view.View.GONE);
                  console.log(">>> Set nested ImageView to GONE");
                }
              }
            } catch(e) {}
          }
        }

      } catch(e) {
        console.log(">>> debugUnfreeze error:", e);
      }
    });
  }

  getARDoubleTapToFreezeEnabled(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.isDoubleTapToFreezeEnabled();
  }

  setResultDisappearanceDelayMs(ms: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setResultDisappearanceDelayMs(ms); });
  }

  getResultDisappearanceDelayMs(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getResultDisappearanceDelayMs();
  }

  setARLocationTransitionSpeed(speed: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setLocationTransitionSpeed(speed); });
  }

  getARLocationTransitionSpeed(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getLocationTransitionSpeed();
  }

  setARSelectedLocationLineWidth(width: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setSelectedLocationLineWidth(width); });
  }

  getARSelectedLocationLineWidth(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getSelectedLocationLineWidth();
  }

  setARNonSelectedLocationLineWidth(width: number): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setNonSelectedLocationLineWidth(width); });
  }

  getARNonSelectedLocationLineWidth(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getNonSelectedLocationLineWidth();
  }

  setARHeaderTextFormat(format: string): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.setHeaderTextFormat(format); });
  }

  getARHeaderTextFormat(format: string): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.getHeaderTextFormat(format);
  }

  setRoiCenterMark(roiCenterMark: number): void {
    this._runWhenReady(() => {
      let nativeRoiCenterMark: any;
      switch (roiCenterMark) {
        case BarkoderConstants.BarkoderRoiCenterMark.CROSSHAIR:
          nativeRoiCenterMark = com.barkoder.enums.BarkoderRoiCenterMark.CROSSHAIR;
          break;
        case BarkoderConstants.BarkoderRoiCenterMark.POINT:
          nativeRoiCenterMark = com.barkoder.enums.BarkoderRoiCenterMark.POINT;
          break;
        case BarkoderConstants.BarkoderRoiCenterMark.NONE:
        default:
          nativeRoiCenterMark = com.barkoder.enums.BarkoderRoiCenterMark.NONE;
          break;
      }
      this.bkdView.config.setRoiCenterMark(nativeRoiCenterMark);
    });
  }

  getRoiCenterMark(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getRoiCenterMark();
  }

  resetARCache(): void {
    this._runWhenReady(() => { this.bkdView.resetArCache(); });
  }

  setARReturnOnlyMatchedResults(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.returnOnlyMatchedResults = enabled; });
  }

  getARReturnOnlyMatchedResults(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.returnOnlyMatchedResults;
  }

  setARDisplayOnlyMatchedResults(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.arConfig.displayOnlyMatchedResults = enabled; });
  }

  getARDisplayOnlyMatchedResults(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.arConfig.displayOnlyMatchedResults;
  }

  setDecoderMatchFilter(filter: string): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().matchFilter = filter; });
  }

  getDecoderMatchFilter(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().matchFilter;
  }

  setDecoderReturnOnlyMatchedResults(enabled: boolean): void {
    this._runWhenReady(() => { this.bkdView.config.getDecoderConfig().returnOnlyMatchedResults = enabled; });
  }

  getDecoderReturnOnlyMatchedResults(): any {
    if (!this.bkdView) return null;
    return this.bkdView.config.getDecoderConfig().returnOnlyMatchedResults;
  }

  configureBarkoder(config: BarkoderConstants.BarkoderConfig): void {
    this._runWhenReady(() => {
      const BarkoderHelper = com.barkoder.BarkoderHelper;
      const JSONObject = org.json.JSONObject;
      try {
        const jsonString = config.toJsonString();
        const javaJSONObject = new JSONObject(jsonString);
        BarkoderHelper.applyJsonToConfig(this.bkdView.config, javaJSONObject);
      } catch (e) {
        console.error("Error applying JSON to BarkoderConfig:", e);
      }
    });
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
function bitmapToImageSource(bitmap: android.graphics.Bitmap): ImageSource {
  const imageSource = new ImageSource();
  imageSource.setNativeSource(bitmap); // This is the key method
  return imageSource;
}