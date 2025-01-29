import hash from "object-hash";
import { faIcon } from '../../utils';

const videoPlayClasses = {
    small: "su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]",
    medium:
        "su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]",
    large: "su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]",
    featured:
        "su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]",
    "vertical-video":
        "su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&>svg]:su-text-[6rem]",
};

export function MediaRatio({
    children = '',
    imageUrl,
    imageAlt,
    aspectRatio = "card-small",
    videoUrl,
}) {
    const aspectRatioMap = new Map();
    aspectRatioMap.set("card-small", "su-aspect-[3/2]");
    aspectRatioMap.set("card-medium", "su-aspect-[3/2]");
    aspectRatioMap.set("card-large", "su-aspect-[3/2]");
    aspectRatioMap.set("card-featured", "su-aspect-[16/9]");
    aspectRatioMap.set("square", "su-aspect-[1/1]");
    aspectRatioMap.set("vertical-video", "su-aspect-[9/16]");

    return `
    <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block ${ aspectRatioMap.get(aspectRatio) }">
        ${videoUrl ? `
        <video class="su-absolute su-object-cover su-object-center su-size-full">
            <source src="${videoUrl}" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        `: ''}
        ${imageUrl ? `
        <img class="su-absolute su-object-cover su-object-center su-size-full" src="${imageUrl}" alt="${imageAlt}" />
        `: ''}
        ${children}
    </span>`;
}

export function CardThumbnail({
    imageUrl,
    alt,
    aspectRatio,
    videoUrl,
    size = "small",
    title,
    videoIconClasses = "",
}) {
    const modalId = hash.MD5(
        JSON.stringify(videoUrl) + hash.MD5(JSON.stringify(title))
    );

    return videoUrl ? `
        <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="${modalId}">
            ${MediaRatio({ 
                imageUrl, 
                imageAlt: `Open video ${alt || ""} in a modal`, 
                aspectRatio, 
                children: `              
                    ${size === "vertical-video" ? `
                        <div aria-hidden="true" class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20"></div>
                    `: ''}
                    ${videoUrl ? `
                        <span class="*:su-w-[40px] su-absolute su-leading-none ${size === "vertical-video" ? "su-z-30": ''} ${videoPlayClasses[size]} ${videoIconClasses}">
                            ${faIcon["CirclePlay"][0].replace(/class=".*?"/, 'class="fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]"')}
                        </span>
                    ` : ''}
                `
            })}
        </button>
    ` : `
        <div class="su-component-card-thumbnail su-w-full su-h-full">
         ${MediaRatio({ imageUrl, imageAlt: alt, aspectRatio, children: '' })}
        </div>
    `;
}

export default CardThumbnail;