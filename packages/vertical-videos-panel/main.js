// import { basicAssetUri, isRealExternalLink } from "../../global/js/utils";
// import { LinkedHeading, container, Carousel, VerticalVideoCard} from "../../global/js/helpers";
import { basicAssetUri, linkedHeadingService } from "../../global/js/utils";
import verticalVideosPanelTemplate from "./vertical-videos-panel.hbs";

export default {
  async main(args, info) {
    const fnsCtx = info?.fns || info?.ctx || {};
    const { videos } = args || {};
    const { title, ctaText, ctaUrl, ctaManualUrl, bgImage, marginBottom } = (args && args.sectionConfiguration) || {};
    // const { title } = (args && args.sectionConfiguration) || {};

    try {
      if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
          throw new Error(
              `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
          );
        }
    } catch (er) {
        console.error('Error occurred in the Single CTA Block component: ', er);
        return `<!-- Error occurred in the Single CTA Block component: ${er.message} -->`;
    }


    // if (videosArray?.length) {
    //   videosArray.forEach(
    //     ({ youtubeId, heading, subheading, videoImageData }) => {
    //       cardData.push(
    //         <VerticalVideoCard
    //           key={`${youtubeId}-${heading}`}
    //           heading={heading}
    //           subheading={subheading}
    //           youtubeId={youtubeId}
    //           videoImageUrl={videoImageData?.url}
    //           videoImageAlt={videoImageData?.alt || heading}
    //         />
    //       );
    //     }
    //   );
    // }


    // const data = await Promise.all(
    //   videos.map(async (video) => {
    //     const { heading, subheading, videoImage, youtubeId } = video;

    //     let imageData = null;

    //     if (videoImage) {
    //         imageData = await basicAssetUri(fnsCtx, videoImage);
    //     }
        
    //     return {
    //       heading,
    //       subheading,
    //       youtubeId,
    //       imageUrl: imageData?.url,
    //       imageAlt: imageData?.attributes?.alt || "",
    //     }
    //   })
    // );



    // Get background image data
    // let bgImageData = null;
    // if (sectionConfiguration?.bgImage) {
    //   bgImageData = await basicAssetUri(ctx, sectionConfiguration.bgImage);
    // }
    // const bgImageUrl = bgImageData?.url;

    // // Get CTA link data  
    // let ctaLink = null;
    // if (sectionConfiguration?.ctaUrl) {
    //   ctaLink = await basicAssetUri(ctx, sectionConfiguration?.ctaUrl);
    // }
    // const ctaInternalUrl = ctaLink?.url;





    // const containerContent = `
    //   <div class="${styles.wrapper}">
    //     ${sectionConfiguration.title ? `
    //       <div class="${styles.headingWrapper}">
    //         ${LinkedHeading({
    //           title: sectionConfiguration.title,
    //           ctaText: sectionConfiguration.ctaText,
    //           ctaLink: sectionConfiguration.ctaManualUrl || ctaInternalUrl,
    //           isAlwaysLight: !!bgImageUrl,
    //           className: styles.sectionHeading
    //         })}
    //       </div>
    //     ` : ""}
    //     ${videosArray?.length ? `
    //       ${videosArray.length > 1 ? `
    //         <div class="${styles.carouselWrapper}">
    //           ${Carousel({
    //             variant: "vertical-videos",
    //             slides: videoCards,
    //             isDark: !!bgImageUrl
    //           })}
    //         </div>
    //       ` : ""}
    //       <div class="${styles.cardGridWrapper(videosArray.length === 1)}">
    //         <div class="${styles.cardGrid(videosArray.length === 1)}">
    //           ${videoCards}
    //         </div>
    //       </div>
    //     ` : ""}
    //   </div>
    //   ${bgImageUrl ? `
    //     <img src="${bgImageUrl}" alt="" class="${styles.bgImage}" />
    //     <div aria-hidden="true" class="${styles.overlay}"></div>
    //   ` : ""}
    // `;


    // if (videosArray?.length) {
    //   videosArray.forEach(
    //     ({ youtubeId, heading, subheading, videoImageData }) => {
    //       cardData.push(
    //         <VerticalVideoCard
    //           key={`${youtubeId}-${heading}`}
    //           heading={heading}
    //           subheading={subheading}
    //           youtubeId={youtubeId}
    //           videoImageUrl={videoImageData?.url}
    //           videoImageAlt={videoImageData?.alt || heading}
    //         />
    //       );
    //     }
    //   );
    // }


    const cardData = await Promise.all(
      videos.map(async (video) => {
        const { heading, subheading, videoImage, youtubeId } = video;

        let imageData = null;

        if (videoImage) {
            imageData = await basicAssetUri(fnsCtx, videoImage);
        }
        
        return {
          heading,
          subheading,
          youtubeId,
          imageUrl: imageData?.url,
          imageAlt: imageData?.attributes?.alt || "",
        }
      })
    );


    // Resolve the URI for the section link
    const sectionData = await linkedHeadingService(
        fnsCtx,
        args.sectionConfiguration
    );

    // Get background image data
    let bgImageData = null;
    bgImageData = await basicAssetUri(fnsCtx, bgImage);


    const componentData = {
      // test: JSON.stringify(cardData),
      test: cardData.length,
      sectionTitle: sectionData?.title,
      sectionCtaText: sectionData?.ctaText,
      sectionCtaLink: sectionData?.ctaLink,
      sectionBgImageUrl: bgImageData?.url,
      sectionBgImageAlt: bgImageData?.alt,
      isSingleVideo: videos.length === 1,
      cardData,
      cardDataSize: cardData.length,
    };

    return verticalVideosPanelTemplate(componentData);

  }
};
