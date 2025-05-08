
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
import UniversityUpdate from "./UniversityUpdates";

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
    "analysis&amp;insights": AnalysisAndInsights,
    "analysis&insights": AnalysisAndInsights,
    "analysis&nbsp;&amp;&nbsp;insights": AnalysisAndInsights,
    "announcement": ({variant}={})=>Announcement({variant}),
    "arrowRight": ArrowRight,
    "arrowsRotate": ({className}={})=>ArrowsRotate({className}),
    "barGraph": ({variant}={})=>BarGraph({variant}),
    "book": ({className}={})=>BookOpenCover({className}),
    "bookOpenCover": ({className}={})=>BookOpenCover({className}),
    "bullseyePointer": ({variant}={})=>BullseyePointer({variant}),
    "case study": ({variant}={})=>CaseStudy({variant}),
    "case&nbsp;study": ({variant}={})=>CaseStudy({variant}),
    "casestudy": ({variant}={})=>CaseStudy({variant}),
    "chevronRight": ({className}={})=>ChevronRight({className}),
    "close": Close,
    "event": Event,
    "event highlights": EventHighlights,
    "event&nbsp;highlights": EventHighlights,
    "eventhighlights": EventHighlights,
    "eventsCalendar": ({variant}={})=>EventsCalendar({variant}),
    "externalArrow": ({size}={})=>ExternalArrow({size}),
    "externalArrowUnstyled": ({className}={})=>ExternalArrowUnstyled({className}),
    "feature": Feature,
    "featuredAudio": ({variant}={})=>FeaturedAudio({variant}),
    "featuredReading": ({variant}={})=>FeaturedReading({variant}),
    "in the news": InTheNews,
    "in&nbsp;the&nbsp;news": InTheNews,
    "inthenews": InTheNews,
    "infographic": Infographic,
    "leadership messages": LeadershipMessages,
    "leadership&nbsp;messages": LeadershipMessages,
    "leadershipmessages": LeadershipMessages,
    "mediaGallery": ({variant}={})=>MediaGallery({variant}),
    "news": News,
    "obituary": Obituary,
    "opinion": Opinion,
    "pause": Pause,
    "photo": Photo,
    "pieChart": ({variant}={})=>PieChart({variant}),
    "play": Play,
    "plus": ({className}={})=>Plus({className}),
    "podcast": ({variant}={})=>Podcast({variant}),
    "policy brief": ({variant}={})=>PolicyBrief({variant}),
    "policy&nbsp;brief": ({variant}={})=>PolicyBrief({variant}),
    "policybrief": ({variant}={})=>PolicyBrief({variant}),
    "poll / quiz": PollQuiz,
    "poll&nbsp;/&nbsp;quiz": PollQuiz,
    "poll/quiz": PollQuiz,
    "profile": Profile,
    "q & a": QuestionAnswer,
    "q&a": QuestionAnswer,
    "q&amp;a": QuestionAnswer,
    "q&nbsp;&amp;&nbsp;a": QuestionAnswer,
    "research": Research,
    "shareLink": ShareLink,
    "solutions": Solutions,
    "survey": Survey,
    "timeline": Timeline,
    "tips & takeaways": TipsAndTakeaways,
    "tips &amp; takeaways": TipsAndTakeaways,
    "tips&amp;takeaways": TipsAndTakeaways,
    "tips&takeaways": TipsAndTakeaways,
    "tips&nbsp;&amp;&nbsp;takeaways": TipsAndTakeaways,
    "trendingUp": ({variant}={})=>TrendingUp({variant}),
    "typeAnnouncement": TypeAnnouncement,
    "university update":UniversityUpdate,
    "university&nbsp;update":UniversityUpdate,
    "universityupdate":UniversityUpdate,
    "university updates":UniversityUpdate,
    "university&nbsp;updates":UniversityUpdate,
    "universityupdates":UniversityUpdate,
    "video": Video,
    "videoPlay": ({variant}={})=>VideoPlay({variant})
};

export default svgIcons;