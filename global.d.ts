import common from "./i18n/messages/en/common.json";
import layout from "./i18n/messages/en/layout.json";
import courses from "./i18n/messages/en/courses.json";
import home from "./i18n/messages/en/home.json";

type Messages = {
  Common: typeof common;
  Layout: typeof layout;
  Courses: typeof courses;
  Home: typeof home;
};

declare global {
  interface IntlMessages extends Messages {}
}
