
declare class AztecCompactConfig extends SpecificConfig {

	static alloc(): AztecCompactConfig; // inherited from NSObject

	static new(): AztecCompactConfig; // inherited from NSObject
}

declare class AztecConfig extends SpecificConfig {

	static alloc(): AztecConfig; // inherited from NSObject

	static new(): AztecConfig; // inherited from NSObject
}

declare const enum BarcodeType {

	T_Aztec = 0,

	T_AztecCompact = 1,

	T_QR = 2,

	T_QRMicro = 3,

	T_Code128 = 4,

	T_Code93 = 5,

	T_Code39 = 6,

	T_Codabar = 7,

	T_Code11 = 8,

	T_Msi = 9,

	T_UpcA = 10,

	T_UpcE = 11,

	T_UpcE1 = 12,

	T_Ean13 = 13,

	T_Ean8 = 14,

	T_PDF417 = 15,

	T_PDF417Micro = 16,

	T_Datamatrix = 17,

	T_Code25 = 18,

	T_Interleaved25 = 19,

	T_ITF14 = 20,

	T_IATA25 = 21,

	T_Matrix25 = 22,

	T_Datalogic25 = 23,

	T_COOP25 = 24,

	T_Code32 = 25,

	T_Telepen = 26,

	T_Dotcode = 27,
	T_IDDocument = 28
}

declare var BarkoderVersionNumber: number;

declare var BarkoderVersionString: interop.Reference<number>;

declare class COOP25Config extends SpecificConfig {

	static alloc(): COOP25Config; // inherited from NSObject

	static new(): COOP25Config; // inherited from NSObject

	checksum: Code25Checksum;
}

declare class CodabarConfig extends SpecificConfig {

	static alloc(): CodabarConfig; // inherited from NSObject

	static new(): CodabarConfig; // inherited from NSObject
}

declare const enum Code11Checksum {

	Code11_Checksum_Disabled = 0,

	Code11_Checksum_Single = 1,

	Code11_Checksum_Double = 2
}

declare class Code11Config extends SpecificConfig {

	static alloc(): Code11Config; // inherited from NSObject

	static new(): Code11Config; // inherited from NSObject

	checksum: Code11Checksum;
}

declare class Code128Config extends SpecificConfig {

	static alloc(): Code128Config; // inherited from NSObject

	static new(): Code128Config; // inherited from NSObject
}

declare const enum Code25Checksum {

	Code25_Checksum_Disabled = 0,

	Code25_Checksum_Enabled = 1
}

declare class Code25Config extends SpecificConfig {

	static alloc(): Code25Config; // inherited from NSObject

	static new(): Code25Config; // inherited from NSObject

	checksum: Code25Checksum;
}

declare class Code32Config extends SpecificConfig {

	static alloc(): Code32Config; // inherited from NSObject

	static new(): Code32Config; // inherited from NSObject
}

declare const enum Code39Checksum {

	Code39_Checksum_Disabled = 0,

	Code39_Checksum_Enabled = 1
}

declare class Code39Config extends SpecificConfig {

	static alloc(): Code39Config; // inherited from NSObject

	static new(): Code39Config; // inherited from NSObject

	checksum: Code39Checksum;
}

declare class Code93Config extends SpecificConfig {

	static alloc(): Code93Config; // inherited from NSObject

	static new(): Code93Config; // inherited from NSObject
}

declare class Config extends NSObject {

	static alloc(): Config; // inherited from NSObject

	static configWithLicenseKeyLicenseCheckHandler(key: string, callback: (p1: LicenseCheckResult) => void): ConfigResponse;

	static getGlobalOption(option: GlobalOption): number;

	static new(): Config; // inherited from NSObject

	static setGlobalOptionValue(option: GlobalOption, value: number): number;

	readonly PDF417: PDF417Config;

	readonly PDF417Micro: PDF417MicroConfig;

	readonly aztec: AztecConfig;

	readonly aztecCompact: AztecCompactConfig;

	readonly codabar: CodabarConfig;

	readonly code11: Code11Config;

	readonly code128: Code128Config;

	readonly code25: Code25Config;

	readonly code32: Code32Config;

	readonly code39: Code39Config;

	readonly code93: Code93Config;

	readonly coop25: COOP25Config;

	readonly datalogic25: Datalogic25Config;

	readonly datamatrix: DatamatrixConfig;

	readonly idDocument: IDDocumentConfig;

	decodingSpeed: DecodingSpeed;

	readonly dotcode: DotcodeConfig;

	duplicatesDelayMs: number;

	readonly ean13: Ean13Config;

	readonly ean8: Ean8Config;

	enableMisshaped1D: boolean;

	enableVINRestrictions: boolean;

	encodingCharacterSet: string;

	formatting: Formatting;

	readonly iata25: IATA25Config;

	readonly interleaved25: Interleaved25Config;

	readonly itf14: ITF14Config;

	readonly matrix25: Matrix25Config;

	maximumResultsCount: number;

	readonly msi: MsiConfig;

	readonly qr: QRConfig;

	readonly qrMicro: QRMicroConfig;

	readonly telepen: TelepenConfig;

	readonly upcA: UpcAConfig;

	readonly upcE: UpcEConfig;

	readonly upcE1: UpcE1Config;

	upcEanDeblur: boolean;

	getAvailableDecoders(): NSArray<number>;

	getConfigForDecoder(decoderType: DecoderType): SpecificConfig;

	getDeviceId(): string;

	getEnabledDecoders(): NSArray<number>;

	getLicenseErrorMessage(): string;

	getcustomOption(option: string): number;

	regionOfInterest(): CGRect;

	setEnabledDecoders(decoders: NSArray<any> | any[]): void;

	setRegionOfInterestWithLeftTopWidthHeight(left: number, top: number, width: number, height: number): void;

	setcustomOptionValue(option: string, value: number): void;
}

declare class ConfigResponse extends NSObject {

	static alloc(): ConfigResponse; // inherited from NSObject

	static new(): ConfigResponse; // inherited from NSObject

	config: Config;

	readonly message: string;

	result: Result;
}

declare class Datalogic25Config extends SpecificConfig {

	static alloc(): Datalogic25Config; // inherited from NSObject

	static new(): Datalogic25Config; // inherited from NSObject

	checksum: Code25Checksum;
}

declare class DatamatrixConfig extends SpecificConfig {

	static alloc(): DatamatrixConfig; // inherited from NSObject

	static new(): DatamatrixConfig; // inherited from NSObject

	dpmMode: number;
}

declare class DecoderResult extends NSObject {

	static alloc(): DecoderResult; // inherited from NSObject

	static new(): DecoderResult; // inherited from NSObject

	barcodeType: BarcodeType;

	barcodeTypeName: string;

	binaryData: NSData;

	characterSet: string;

	extra: NSDictionary<any, any>;

	textualData: string;

	getAllKeys(): NSArray<string>;

	getLocationPoints(): interop.Pointer | interop.Reference<CGPoint>;

	getStringForKey(key: string): string;

	locationAt(index: number): CGPoint;

	polygonPointAt(index: number): CGPoint;

	polygonPointCount(): number;
}

declare const enum DecoderType {

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

	Dotcode = 27
}

declare const enum DecodingSpeed {

	Fast = 0,

	Normal = 1,

	Slow = 2
}

declare class DotcodeConfig extends SpecificConfig {

	static alloc(): DotcodeConfig; // inherited from NSObject

	static new(): DotcodeConfig; // inherited from NSObject
}

declare class IDDocumentConfig extends SpecificConfig {

	static alloc(): IDDocumentConfig; // inherited from NSObject

	static new(): IDDocumentConfig; // inherited from NSObject
}

declare class Ean13Config extends SpecificConfig {

	static alloc(): Ean13Config; // inherited from NSObject

	static new(): Ean13Config; // inherited from NSObject
}

declare class Ean8Config extends SpecificConfig {

	static alloc(): Ean8Config; // inherited from NSObject

	static new(): Ean8Config; // inherited from NSObject
}

declare const enum Formatting {

	Disabled = 0,

	Automatic = 1,

	GS1 = 2,

	AAMVA = 3
}

declare const enum GlobalOption {

	SetMaximumThreads = 0,

	UseGPU = 1,

	MulticodeCachingEnabled = 2,

	MulticodeCachingDuration = 3
}

declare class IATA25Config extends SpecificConfig {

	static alloc(): IATA25Config; // inherited from NSObject

	static new(): IATA25Config; // inherited from NSObject

	checksum: Code25Checksum;
}

declare class ITF14Config extends SpecificConfig {

	static alloc(): ITF14Config; // inherited from NSObject

	static new(): ITF14Config; // inherited from NSObject
}

declare class Image extends NSObject {

	static alloc(): Image; // inherited from NSObject

	static new(): Image; // inherited from NSObject

	readonly height: number;

	pixels: string;

	readonly width: number;

	constructor(o: { pixels: string | interop.Pointer | interop.Reference<any>; width: number; height: number; });

	initWithPixelsWidthHeight(pixels: string | interop.Pointer | interop.Reference<any>, width: number, height: number): this;
}

declare class Interleaved25Config extends SpecificConfig {

	static alloc(): Interleaved25Config; // inherited from NSObject

	static new(): Interleaved25Config; // inherited from NSObject

	checksum: Code25Checksum;
}

declare const enum LicenseCheckCode {

	C_OK = 0,

	C_OK_NeedServer = 1,

	C_Error = 2
}

declare class LicenseCheckResult extends NSObject {

	static alloc(): LicenseCheckResult; // inherited from NSObject

	static new(): LicenseCheckResult; // inherited from NSObject

	code: LicenseCheckCode;

	message: string;
}

declare class Matrix25Config extends SpecificConfig {

	static alloc(): Matrix25Config; // inherited from NSObject

	static new(): Matrix25Config; // inherited from NSObject

	checksum: Code25Checksum;
}

declare const enum MsiChecksum {

	Msi_Checksum_Disabled = 0,

	Msi_Checksum_Mod10 = 1,

	Msi_Checksum_Mod11 = 2,

	Msi_Checksum_Mod1010 = 3,

	Msi_Checksum_Mod1110 = 4,

	Msi_Checksum_Mod11IBM = 5,

	Msi_Checksum_Mod1110IBM = 6
}

declare class MsiConfig extends SpecificConfig {

	static alloc(): MsiConfig; // inherited from NSObject

	static new(): MsiConfig; // inherited from NSObject

	checksum: MsiChecksum;
}

declare class PDF417Config extends SpecificConfig {

	static alloc(): PDF417Config; // inherited from NSObject

	static new(): PDF417Config; // inherited from NSObject
}

declare class PDF417MicroConfig extends SpecificConfig {

	static alloc(): PDF417MicroConfig; // inherited from NSObject

	static new(): PDF417MicroConfig; // inherited from NSObject
}

declare class QRConfig extends SpecificConfig {

	static alloc(): QRConfig; // inherited from NSObject

	static new(): QRConfig; // inherited from NSObject

	multiPartMerge: boolean;
}

declare class QRMicroConfig extends SpecificConfig {

	static alloc(): QRMicroConfig; // inherited from NSObject

	static new(): QRMicroConfig; // inherited from NSObject
}

declare const enum Result {

	OK = 0,

	Error = 1,

	Warning = 2
}

declare class SpecificConfig extends NSObject {

	static alloc(): SpecificConfig; // inherited from NSObject

	static new(): SpecificConfig; // inherited from NSObject

	enabled: boolean;

	expectedCount: number;

	readonly maximumLength: number;

	readonly minimumLength: number;

	constructor(o: { decoderType: DecoderType; });

	decoderType(): DecoderType;

	initWithDecoderType(decoderType: DecoderType): this;

	isLicensed(): boolean;

	setLengthRangeWithMinimumMaximum(minimumLength: number, maximumLength: number): number;

	typeName(): string;
}

declare class TelepenConfig extends SpecificConfig {

	static alloc(): TelepenConfig; // inherited from NSObject

	static new(): TelepenConfig; // inherited from NSObject
}

declare class UpcAConfig extends SpecificConfig {

	static alloc(): UpcAConfig; // inherited from NSObject

	static new(): UpcAConfig; // inherited from NSObject
}

declare class UpcE1Config extends SpecificConfig {

	static alloc(): UpcE1Config; // inherited from NSObject

	static new(): UpcE1Config; // inherited from NSObject

	expandToUPCA: boolean;
}

declare class UpcEConfig extends SpecificConfig {

	static alloc(): UpcEConfig; // inherited from NSObject

	static new(): UpcEConfig; // inherited from NSObject

	expandToUPCA: boolean;
}

declare class iBarkoder extends NSObject {

	static CGImageFromPixelsWidthHeight(pixels: string | interop.Pointer | interop.Reference<any>, width: number, height: number): any;

	static CGImageToPixels(image: any): string;

	static GetLibVersion(): string;

	static GetVersion(): string;

	static IsDecoderBusy(): boolean;

	static UIImageFromPixelsWidthHeight(pixels: string | interop.Pointer | interop.Reference<any>, width: number, height: number): UIImage;

	static alloc(): iBarkoder; // inherited from NSObject

	static decodeImageAsyncImageCallback(config: Config, image: Image, callback: (p1: NSArray<DecoderResult>, p2: Image) => void): number;

	static decodeImageInMemoryImagePixelsImageWidthImageHeight(config: Config, pixels: string | interop.Pointer | interop.Reference<any>, width: number, height: number): NSArray<DecoderResult>;

	static decodeSampleBufferAsyncSampleBufferCallback(config: Config, sampleBuffer: any, callback: (p1: NSArray<DecoderResult>, p2: any) => void): number;

	static new(): iBarkoder; // inherited from NSObject
}
