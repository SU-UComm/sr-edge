
import LetterA from "./Letters/A";
import LetterB from "./Letters/B";
import LetterC from "./Letters/C";
import LetterD from "./Letters/D";
import LetterE from "./Letters/E";
import LetterF from "./Letters/F";
import LetterG from "./Letters/G";
import LetterH from "./Letters/H";
import LetterI from "./Letters/I";
import LetterJ from "./Letters/J";
import LetterK from "./Letters/K";
import LetterL from "./Letters/L";
import LetterM from "./Letters/M";
import LetterN from "./Letters/N";
import LetterO from "./Letters/O";
import LetterP from "./Letters/P";
import LetterR from "./Letters/R";
import LetterS from "./Letters/S";
import LetterT from "./Letters/T";
import LetterU from "./Letters/U";
import LetterV from "./Letters/V";
import LetterW from "./Letters/W";
import LetterX from "./Letters/X";
import LetterY from "./Letters/Y";
import LetterZ from "./Letters/Z";
import Alert from "./Alert";
import AnalysisAndInsights from "./AnalysisAndInsights";
import Announcement from "./Announcement";
import TypeAnnouncement from "./TypeAnnouncement";
import CaseStudy from "./CaseStudy";
import News from "./News";
import BookOpenCover from "./BookOpenCover";
import Event from "./Event";
import EventsCalendar from "./EventsCalendar";
import Feature from "./Feature";
import FeaturedReading from "./FeaturedReading";
import FeaturedAudio from "./FeaturedAudio";
import EventHighlights from "./EventHighlights";
import ExternalArrow from "./ExternalArrow";
import ExternalArrowUnstyled from "./ExternalArrowUnstyled";
import ArrowsRotate from "./ArrowsRotate";
import Infographic from "./Infographic";
import InTheNews from "./InTheNews";
import LeadershipMessages from "./LeadershipMessages";
import MediaGallery from "./MediaGallery";
import Obituary from "./Obituary";
import Opinion from "./Opinion";
import Photo from "./Photo";
import Plus from "./Plus";
import Podcast from "./Podcast";
import PollQuiz from "./PollQuiz";
import PolicyBrief from "./PolicyBrief";
import Profile from "./Profile";
import QuestionAnswer from "./QuestionAnswer";
import Research from "./Research";
import Solutions from "./Solutions";
import Survey from "./Survey";
import Timeline from "./Timeline";
import TipsAndTakeaways from "./TipsAndTakeaways";
import Video from "./Video";
import VideoPlay from './VideoPlay'
import ChevronRight from "./ChevronRight";
import Close from "./Close";
import BullseyePointer from "./BullseyePointer";
import PieChart from "./PieChart";
import BarGraph from "./BarGraph";
import ShareLink from "./ShareLink";
import Pause from "./Pause";
import Play from "./Play";
import ArrowRight from "./ArrowRight";
import TrendingUp from "./TrendingUp";

export const svgIcons = {
    "a": LetterA,
    "b": LetterB,
    "c": LetterC,
    "d": LetterD,
    "e": LetterE,
    "f": LetterF,
    "g": LetterG,
    "h": LetterH,
    "i": LetterI,
    "j": LetterJ,
    "k": LetterK,
    "l": LetterL,
    "m": LetterM,
    "n": LetterN,
    "o": LetterO,
    "p": LetterP,
    "r": LetterR,
    "s": LetterS,
    "t": LetterT,
    "u": LetterU,
    "v": LetterV,
    "w": LetterW,
    "x": LetterX,
    "y": LetterY,
    "z": LetterZ,
    "alert": Alert,
    "analysis & insights": AnalysisAndInsights,
    "analysis &amp; insights": AnalysisAndInsights,
    "analysis&nbsp;&amp;&nbsp;insights": AnalysisAndInsights,
    "announcement": ({variant}={})=>Announcement({variant}),
    "typeAnnouncement": TypeAnnouncement,
    "case study":  ({variant}={})=>CaseStudy({variant}),
    "case&nbsp;study":  ({variant}={})=>CaseStudy({variant}),
    "casestudy":  ({variant}={})=>CaseStudy({variant}),
    "news": News,
    "bookOpenCover": ({className}={})=>BookOpenCover({className}),
    "event": Event,
    "eventsCalendar": ({variant}={})=>EventsCalendar({variant}),
    "feature": Feature,
    "featuredReading": ({variant}={})=>FeaturedReading({variant}),
    "featuredAudio": ({variant}={})=>FeaturedAudio({variant}),
    "event&nbsp;highlights": EventHighlights,
    "event highlights": EventHighlights,
    "externalArrow":({size}={})=>ExternalArrow({size}),
    "externalArrowUnstyled": ({className}={})=>ExternalArrowUnstyled({className}),
    "arrowsRotate": ({className}={})=>ArrowsRotate({className}),
    "infographic": Infographic,
    "in&nbsp;the&nbsp;news": InTheNews,
    "in the news": InTheNews,
    "inthenews": InTheNews,
    "leadership&nbsp;messages": LeadershipMessages,
    "leadership messages": LeadershipMessages,
    "mediaGallery": ({variant}={})=>MediaGallery({variant}),
    "obituary": Obituary,
    "opinion": Opinion,
    "photo": Photo,
    "plus": ({className}={})=>Plus({className}),
    "podcast": ({variant}={})=>Podcast({variant}),
    "poll/quiz": PollQuiz,
    "poll / quiz": PollQuiz,
    "poll&nbsp;/&nbsp;quiz": PollQuiz,
    "policy&nbsp;brief": ({variant}={})=>PolicyBrief({variant}),
    "policy brief": ({variant}={})=>PolicyBrief({variant}),
    "profile": Profile,
    "q&amp;a": QuestionAnswer,
    "q & a": QuestionAnswer,
    "q&nbsp;&amp;&nbsp;a": QuestionAnswer,
    "research": Research,
    "solutions": Solutions,
    "survey": Survey,
    "timeline": Timeline,
    "tips & takeaways": TipsAndTakeaways,
    "tips &amp; takeaways": TipsAndTakeaways,
    "tips&nbsp;&amp;&nbsp;takeaways": TipsAndTakeaways,
    "video": Video,
    "chevronRight": ({className}={})=>ChevronRight({className}),
    "close": Close,
    "bullseyePointer": ({variant}={})=>BullseyePointer({variant}),
    "pieChart": ({variant}={})=>PieChart({variant}),
    "barGraph": ({variant}={})=>BarGraph({variant}),
    "shareLink": ShareLink,
    "pause": Pause,
    "play": Play,
    "arrowRight": ArrowRight,
    "trendingUp": ({variant}={})=>TrendingUp({variant}),
    "videoPlay": ({variant}={})=>VideoPlay({variant})
};

export default svgIcons;