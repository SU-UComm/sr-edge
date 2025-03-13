
import {VerticalCard} from "./verticalCard";
import {PullQuoteCard} from "./pullQuoteCard";
import {HorizontalCard} from "./horizontalCard";
import {TeaserCard} from "./teaserCard";
import {MediaCard} from "./mediaCard";
import {AvatarCard} from "./avatarCard";
import {NarrowHorizontalCard} from "./narrowHorizontalCard";
/**
 * Creates a card based on the specified type
 * 
 * @param {Object} props
 * @param {Object} props.data - Card data containing title, description, liveUrl, imageUrl, etc.
 * @param {string} props.cardType - Type of card (vertical, horizontal, teaser, avatar, etc.)
 * @param {string} props.cardSize - Size of the card (small, medium, featured)
 * @param {boolean} props.displayDescription - Whether to show description
 * @param {boolean} props.displayThumbnail - Whether to show thumbnail
 * @param {number} props.headingLvl - Heading level (2 or 3)
 * @returns {string} HTML string for the appropriate card type
 */
export function Card({
  data,
  cardType,
  cardSize = "small",
  displayDescription = true,
  displayThumbnail = true,
  headingLvl = 2,
}) {
  if (!data) return '';

  // Return appropriate card type
  switch (cardType) {
    case "horizontal":
      return HorizontalCard({ data, cardSize });
    case "teaser":
      return TeaserCard({ data });
    case "avatar":
      return AvatarCard({ data });
    case "pullquote":
      return PullQuoteCard({ data });
    case "media":
      return MediaCard({ data });
    case "narrowhorizontal":
      return NarrowHorizontalCard({ data });
    default:
      return VerticalCard({
        data,
        cardSize,
        displayDescription,
        displayThumbnail,
        headingLvl
      });
  }
}
