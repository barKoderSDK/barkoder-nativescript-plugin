
declare class BarkoderConfig extends NSObject {
    encodingCharacterSet: any;

	static alloc(): BarkoderConfig; // inherited from NSObject

	static new(): BarkoderConfig; // inherited from NSObject

	barcodeThumbnailOnResult: boolean;

	barkoderResolution: BarkoderResolution;

	beepOnSuccessEnabled: boolean;

	closeSessionOnResultEnabled: boolean;

	decoderConfig: Config;

	imageResultEnabled: boolean;

	locationInImageResultEnabled: boolean;

	locationInPreviewEnabled: boolean;

	locationLineColor: UIColor;

	locationLineWidth: number;

	pinchToZoomEnabled: boolean;

	regionOfInterestVisible: boolean;

	roiLineColor: UIColor;

	roiLineWidth: number;

	roiOverlayBackgroundColor: UIColor;

	thresholdBetweenDuplicatesScans: number;

	vibrateOnSuccessEnabled: boolean;

	constructor(o: { licenseKey: string; licenseCheckHandler: (p1: LicenseCheckResult) => void; });

	getMulticodeCachingDuration(): number;

	getMulticodeCachingEnabled(): boolean;

	getRegionOfInterest(): CGRect;

	getThreadsLimit(): number;

	initWithLicenseKeyLicenseCheckHandler(licenseKey: string, licenseCheckHandler: (p1: LicenseCheckResult) => void): this;

	setMulticodeCachingDuration(value: number): void;

	setMulticodeCachingEnabled(boolean: boolean): void;

	setRegionOfInterestError(value: CGRect): boolean;

	setThreadsLimitError(value: number): boolean;
}

declare const enum BarkoderConfigTemplate {

	All = 0,

	Pdf_optimized = 1,

	Qr = 2,

	Retail_1d = 3,

	Industrial_1d = 4,

	All_2d = 5,

	Dpm = 6,

	Vin = 7,

	Dotcode = 8,

	All_1d = 9
}

declare class BarkoderHelper extends NSObject {

	static alloc(): BarkoderHelper; // inherited from NSObject

	static applyConfigSettingsFromFileUrlFinished(config: BarkoderConfig, url: string, finished: (p1: BarkoderConfig, p2: NSError) => void): void;

	static applyConfigSettingsFromJsonJsonDataFinished(config: BarkoderConfig, jsonData: NSData, finished: (p1: BarkoderConfig, p2: NSError) => void): void;

	static applyConfigSettingsFromTemplateTemplateFinished(config: BarkoderConfig, template_: BarkoderConfigTemplate, finished: (p1: BarkoderConfig) => void): void;

	static applyConfigSettingsFromURLUrlFinished(config: BarkoderConfig, url: NSURL, finished: (p1: BarkoderConfig, p2: NSError) => void): void;

	static configToJSON(barkoderConfig: BarkoderConfig): string;

	static new(): BarkoderHelper; // inherited from NSObject

	static scanImageBkdConfigResultDelegate(image: UIImage, bkdConfig: BarkoderConfig, resultDelegate: BarkoderResultDelegate): void;
}

interface BarkoderPerformanceDelegate {

	performanceReceivedWithFpsDps?(fps: number, dps: number): void;
}
declare var BarkoderPerformanceDelegate: {

	prototype: BarkoderPerformanceDelegate;
};

interface BarkoderPreviewFramesDelegate {

	cameraFrameReceivedWithSampleBuffer?(sampleBuffer: any): void;
}
declare var BarkoderPreviewFramesDelegate: {

	prototype: BarkoderPreviewFramesDelegate;
};

declare const enum BarkoderResolution {

	Normal = 0,

	High = 1
}

interface BarkoderResultDelegate {

	scanningFinishedThumbnailsImage(decoderResults: NSArray<DecoderResult> | DecoderResult[], thumbnails: NSArray<UIImage> | UIImage[], image: UIImage): void;
}
declare var BarkoderResultDelegate: {

	prototype: BarkoderResultDelegate;
};

declare var BarkoderSDKVersionNumber: number;

declare var BarkoderSDKVersionString: interop.Reference<number>;

declare class BarkoderView extends UIView implements BarkoderPreviewFramesDelegate {

	static alloc(): BarkoderView; // inherited from NSObject

	static appearance(): BarkoderView; // inherited from UIAppearance

	static appearanceForTraitCollection(trait: UITraitCollection): BarkoderView; // inherited from UIAppearance

	static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): BarkoderView; // inherited from UIAppearance

	static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): BarkoderView; // inherited from UIAppearance

	static appearanceWhenContainedIn(ContainerClass: typeof NSObject): BarkoderView; // inherited from UIAppearance

	static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): BarkoderView; // inherited from UIAppearance

	static new(): BarkoderView; // inherited from NSObject

	config: BarkoderConfig;

	cameraFrameReceivedWithSampleBuffer(sampleBuffer: any): void;

	getMaxZoomFactor(completion: (p1: number) => void): void;

	isFlashAvailable(completion: (p1: boolean) => void): void;

	pauseScanning(): void;

	setBarkoderPerformanceDelegate(delegate: BarkoderPerformanceDelegate): void;

	setFlash(enabled: boolean): void;

	setPreviewFramesDelegate(delegate: BarkoderPreviewFramesDelegate): void;

	setZoomFactor(zoomFactor: number): void;

	startCamera(): void;

	startScanningError(resultDelegate: BarkoderResultDelegate): boolean;

	stopScanning(): void;
}
