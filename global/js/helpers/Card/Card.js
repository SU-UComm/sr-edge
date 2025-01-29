import { VerticalCard } from "../VerticalCard";
// import PullQuoteCard from "./PullQuoteCard";
// import HorizontalCard from "./HorizontalCard";
// import TeaserCard from "./TeaserCard";
// import MediaCard from "./MediaCard";
// import AvatarCard from "./AvatarCard";
// import NarrowHorizontalCard from "./NarrowHorizontalCard";

/**
 * This component orchestrates the type of card
 * returned to the main component.
 *
 * @param {object} data
 * The data to feed into the card, containing things such as:
 * title, description, liveUrl, imageUrl, etc...
 *
 * @param {string} cardType
 * the type of card, can be the following:
 * vertical, horizontal, teaser, avatar, etc...
 *
 * @param {string} cardSize
 * The size of the card.
 * small, medium or featured
 *
 * @param {bool} limitedDescription
 * Determines if the card's description should be shown or not.
 *
 * @param {bool} hideImages
 * Determines if the card should display images or not.
 *
 * @return {string}
 */
export function Card ({
        data,
        cardType,
        cardSize = "small",
        displayDescription = true,
        displayThumbnail = true,
        headingLvl = 2,
    }) 
    {
    if (data === undefined) {
        return "";
    }
    // orchestrate the type of card to output
    switch (cardType) {
        // case "horizontal":
        //     return HorizontalCard({ data, cardSize})
        // case "teaser":
        //     return TeaserCard({ data });
        // case "avatar":
        //     return AvatarCard({ data });
        // case "pullquote":
        //     return PullQuoteCard({ data });
        // case "media":
        //     return MediaCard({ data });
        // case "narrowhorizontal":
        //     return NarrowHorizontalCard({ data });
        default:
            return VerticalCard({ data, cardSize, displayDescription, displayThumbnail, headingLvl });
    }
}

export default Card;