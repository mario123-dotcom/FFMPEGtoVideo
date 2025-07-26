"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const setAnimation_1 = __importDefault(require("./setAnimation"));
const getImageDimensions_1 = __importDefault(require("../utilities/getImageDimensions"));
const parseColorValue_1 = __importDefault(require("../utilities/parseColorValue"));
function setImgFilter(image, videoSettings, index, isLast) {
    const inputStream = `[${index}:v]`;
    const outputStream = (isLast && index == 0) ? `[output]` : `[track${index + 1}]`;
    let proportionsFilter = '';
    let padFilter = '';
    let cropFilter = '';
    let overlay = '';
    let animation = [];
    const imageDimensions = (0, getImageDimensions_1.default)(image.source);
    const proportions = {
        width: imageDimensions.width || 0,
        height: imageDimensions.height || 0,
    };
    const imageWidth = image.width || proportions.width;
    const imageHeight = image.height || proportions.height;
    switch (image.fit) {
        case 'contain':
            if (proportions.height < videoSettings.height && proportions.width < videoSettings.width) {
                proportionsFilter = `scale=${videoSettings.width}:${videoSettings.height}:force_original_aspect_ratio=decrease`;
                padFilter = `,pad=${videoSettings.width}:${videoSettings.height}:(ow-iw)/2:(oh-ih)/2`;
            }
            else if (proportions.height > videoSettings.height && proportions.width > videoSettings.width) {
                proportionsFilter = `crop=${videoSettings.width}:${videoSettings.height}`;
            }
            else {
                proportionsFilter = `crop=${proportions.width}:${videoSettings.height}`;
                if (proportions.width < videoSettings.width) {
                    padFilter = `,pad=${videoSettings.width}:${videoSettings.height}:(ow-iw)/2:(oh-ih)/2`;
                }
            }
            break;
        case 'fixed':
            if (image.width && image.height) {
                const scaleWidth = image.width;
                const scaleHeight = image.height;
                proportionsFilter = `scale=${scaleWidth}:${scaleHeight}:force_original_aspect_ratio=decrease`;
                if (scaleWidth < videoSettings.width || scaleHeight < videoSettings.height) {
                    padFilter = `,pad=${videoSettings.width}:${videoSettings.height}:(ow-iw)/2:(oh-ih)/2`;
                }
                else if (scaleWidth >= videoSettings.width && scaleHeight >= videoSettings.height) {
                    proportionsFilter = `scale=${videoSettings.width}:${videoSettings.height}`;
                    if (scaleWidth > videoSettings.width || scaleHeight > videoSettings.height) {
                        cropFilter = `,crop=${videoSettings.width}:${videoSettings.height}`;
                    }
                }
            }
            else {
                throw new Error("La modalità FIXED richiede i valori x_image_width ed y_image_height.");
            }
            break;
        default:
            proportionsFilter = `scale=${videoSettings.width}:${videoSettings.height}:force_original_aspect_ratio=decrease`;
            if (imageWidth < videoSettings.width || imageHeight < videoSettings.height) {
                padFilter = `,pad=${videoSettings.width}:${videoSettings.height}:(ow-iw)/2:(oh-ih)/2`;
            }
            break;
    }
    const colorOverlayFilter = image.color_overlay
        ? [
            (0, parseColorValue_1.default)(image.color_overlay, 'r') !== null ? `rr=${(0, parseColorValue_1.default)(image.color_overlay, 'r')}` : '',
            (0, parseColorValue_1.default)(image.color_overlay, 'g') !== null ? `gg=${(0, parseColorValue_1.default)(image.color_overlay, 'g')}` : '',
            (0, parseColorValue_1.default)(image.color_overlay, 'b') !== null ? `bb=${(0, parseColorValue_1.default)(image.color_overlay, 'b')}` : '',
            (0, parseColorValue_1.default)(image.color_overlay, 'a') !== null ? `aa=${(0, parseColorValue_1.default)(image.color_overlay, 'a')}` : ''
        ].filter(Boolean).join(':')
        : '';
    const color = colorOverlayFilter ? `,format=rgba,colorchannelmixer=${colorOverlayFilter}` : '';
    let result = ["", ""];
    animation = (0, setAnimation_1.default)(image, videoSettings);
    if (animation[1]) {
        overlay = index > 0 && isLast
            ? `[track${index}][track${index + 1}]${animation[1]}[output]`
            : `[track${index}][track${index + 1}]${animation[1]}[track${index + 1}]`;
    }
    else if (index > 0 && isLast) {
        overlay = `[track${index}][track${index + 1}]overlay=shortest=1[output]`;
    }
    else if (index > 0) {
        overlay = `[track${index}][track${index + 1}]overlay=shortest=1[track${index + 1}]`;
    }
    result[1] = overlay;
    result[0] = `${inputStream}${proportionsFilter}${padFilter}${cropFilter}${animation[0]}${color}${outputStream}`;
    return result;
}
exports.default = setImgFilter;
