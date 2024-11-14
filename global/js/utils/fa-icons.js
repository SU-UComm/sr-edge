import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faTriangleExclamation, faChartSimple, faChevronRight, faNewspaper, faMicroscope, faUser, faBullhorn, faFile, faCalendar, faStar, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faFlag, faCirclePlay } from '@fortawesome/free-regular-svg-icons';

// Adding selected icons to library
library.add(
    faArrowUpRightFromSquare,
    faBullhorn,
    faFile,
    faStar,
    faCalendar,
    faTriangleExclamation,
    faChartSimple,
    faChevronRight,
    faMicroscope,
    faNewspaper,
    faUser,
    faCirclePlay,
    faFlag,
    faArrowUpRightFromSquare,
    faCirclePlay
);

// Exporting individual icons for future use
export const faArrowUpRightFromSquareIcon = icon({ prefix: 'fas', iconName: 'arrow-up-right-from-square' }).html; // to change to arrow-up-right only pro
export const faTriangleExclamationIcon = icon({ prefix: 'fas', iconName: 'triangle-exclamation' }).html;
export const faChartSimpleIcon = icon({ prefix: 'fas', iconName: 'chart-simple' }).html; // to change to chart-mixed only pro
export const faChevronRightIcon = icon({ prefix: 'fas', iconName: 'chevron-right' }).html;
export const faMicroscopeIcon = icon({ prefix: 'fas', iconName: 'microscope' }).html;
export const faNewspaperIcon = icon({ prefix: 'fas', iconName: 'newspaper' }).html;
export const faBullhornIcon = icon({ prefix: 'fas', iconName: 'bullhorn' }).html;
export const faUserIcon = icon({ prefix: 'fas', iconName: 'user' }).html;
export const faStarIcon = icon({ prefix: 'fas', iconName: 'star' }).html;
export const faFileIcon = icon({ prefix: 'fas', iconName: 'file' }).html; // to change to file-magnifying-glass only pro
export const faCalendarIcon = icon({ prefix: 'fas', iconName: 'calendar' }).html; // to change to calendar-star only pro
export const faCirclePlayIcon = icon({ prefix: 'far', iconName: 'circle-play' }).html;
export const faFlagIcon = icon({ prefix: 'far', iconName: 'flag' }).html;
export const faArrowUpRightIcon = icon({ prefix: 'fas', iconName: 'arrow-up-right-from-square' }).html;

// Exporting an object with all icons
export const faIcon = {
    ArrowUpRight: faArrowUpRightFromSquareIcon,
    Alert: faTriangleExclamationIcon,
    AnalysisAndInsights: faChartSimpleIcon,
    Announcement: faBullhornIcon,
    CaseStudy: faFileIcon,
    Event: faCalendarIcon,
    EventHighlights: '',
    Feature: faStarIcon,
    Infographic: '',
    InTheNews: '',
    LeadershipMessages: '',
    Obituary: '',
    Opinion: '',
    Photo: '',
    PolicyBrief: '',
    PollQuiz: '',
    Profile: faUserIcon,
    Research: faMicroscopeIcon,
    Solutions: '',
    Survey: '',
    Timeline: '',
    TipsAndTakeaways: '',
    TypeAnnouncement: '',
    News: faNewspaperIcon,
    QuestionAnswer: '',
    Video: '',
    Podcast: '',
    BookOpenCover: '',
    ChevronRight: faChevronRightIcon,
    CirclePlay: faCirclePlayIcon,
}

export default faIcon;
