import { ImageSourcePropType } from "react-native";
import { Routes } from "./RootNavigator";

import ball from "../assets/images/ball.png";
import intIcon from "../assets/images/int.png";
import argIcon from "../assets/images/arg.png";
import ingIcon from "../assets/images/ing.png";
import espIcon from "../assets/images/esp.png";
import itaIcon from "../assets/images/ita.png";
import deuIcon from "../assets/images/deu.png";
import fraIcon from "../assets/images/fra.png";
import porIcon from "../assets/images/por.png";
import braIcon from "../assets/images/bra.png";
import uruIcon from "../assets/images/uru.png";
import parIcon from "../assets/images/par.png";
import colIcon from "../assets/images/col.png";
import chiIcon from "../assets/images/chi.png";
import mexIcon from "../assets/images/mex.png";
import usaIcon from "../assets/images/usa.png";
import { MobileRoutes } from "open-football-project-core";

interface NavDetails {
  title: string;
  route: MobileRoutes;
  isTranslated?: boolean;
  params?: Record<string, string>;
}

interface NavData {
  name: string;
  icon: ImageSourcePropType;
  navLinks: NavDetails[];
}

export const navigationData: NavData[] = [
  {
    icon: ball,
    name: "navigationTitles.mainmenu",
    navLinks: [
      { title: "navbar.home", route: Routes.LANDING, isTranslated: true },
      { title: "navbar.live", route: Routes.LIVE, isTranslated: true },
      { title: "navbar.charts", route: Routes.CHARTS, isTranslated: true },
      { title: "navbar.today_players", route: Routes.TODAY_PLAYERS, isTranslated: true },
      { title: "navbar.matches", route: Routes.MATCHES, isTranslated: true },
      { title: "navbar.leagues", route: Routes.ALL_LEAGUES, isTranslated: true },
    ],
  },

  {
    icon: intIcon,
    name: "navigationTitles.international",
    navLinks: [
      { title: "UEFA Champions League", route: Routes.LEAGUE, params: { leagueId: "2" } },
      { title: "UEFA Europa League", route: Routes.LEAGUE, params: { leagueId: "3" } },
      { title: "CONMEBOL Libertadores", route: Routes.LEAGUE, params: { leagueId: "13" } },
      { title: "CONMEBOL Sudamericana", route: Routes.LEAGUE, params: { leagueId: "11" } },
      { title: "FIFA Club World Cup", route: Routes.LEAGUE, params: { leagueId: "15" } },
      { title: "World Cup", route: Routes.LEAGUE, params: { leagueId: "1" } },
      { title: "World Cup - Qualification Europe", route: Routes.LEAGUE, params: { leagueId: "32" } },
      { title: "World Cup - Qualification South America", route: Routes.LEAGUE, params: { leagueId: "34" } },
      { title: "World Cup - Qualification Asia", route: Routes.LEAGUE, params: { leagueId: "30" } },
      { title: "World Cup - Qualification Africa", route: Routes.LEAGUE, params: { leagueId: "29" } },
      { title: "World Cup - Qualification CONCACAF", route: Routes.LEAGUE, params: { leagueId: "31" } },
    ],
  },
  {
    icon: espIcon,
    name: "country.spain",
    navLinks: [
      { title: "La Liga", route: Routes.LEAGUE, params: { leagueId: "140" } },
      { title: "Segunda División", route: Routes.LEAGUE, params: { leagueId: "141" } },
    ],
  },
  {
    icon: itaIcon,
    name: "country.italy",
    navLinks: [
      { title: "Serie A", route: Routes.LEAGUE, params: { leagueId: "135" } },
      { title: "Serie B", route: Routes.LEAGUE, params: { leagueId: "136" } },
    ],
  },

  {
    icon: argIcon,
    name: "country.argentina",
    navLinks: [
      { title: "Liga Profesional Argentina", route: Routes.LEAGUE, params: { leagueId: "128" } },
      { title: "Primera Nacional", route: Routes.LEAGUE, params: { leagueId: "129" } },
      { title: "Copa Argentina", route: Routes.LEAGUE, params: { leagueId: "130" } },
      { title: "Primera B Metropolitana", route: Routes.LEAGUE, params: { leagueId: "131" } },
      { title: "Primera C", route: Routes.LEAGUE, params: { leagueId: "132" } },
      { title: "Torneo Federal A", route: Routes.LEAGUE, params: { leagueId: "134" } },
      { title: "Reserve League", route: Routes.LEAGUE, params: { leagueId: "906" } },
    ],
  },

  {
    icon: ingIcon,
    name: "country.england",
    navLinks: [
      { title: "Premier League", route: Routes.LEAGUE, params: { leagueId: "39" } },
      { title: "Championship", route: Routes.LEAGUE, params: { leagueId: "40" } },
      { title: "National League", route: Routes.LEAGUE, params: { leagueId: "43" } },
      { title: "League One", route: Routes.LEAGUE, params: { leagueId: "41" } },
      { title: "League Two", route: Routes.LEAGUE, params: { leagueId: "42" } },
      { title: "FA Cup", route: Routes.LEAGUE, params: { leagueId: "45" } },
    ],
  },
  {
    icon: deuIcon,
    name: "country.germany",
    navLinks: [
      { title: "Bundesliga", route: Routes.LEAGUE, params: { leagueId: "78" } },
      { title: "2. Bundesliga", route: Routes.LEAGUE, params: { leagueId: "79" } },
      { title: "3. Liga", route: Routes.LEAGUE, params: { leagueId: "80" } },
    ],
  },
  {
    icon: fraIcon,
    name: "country.france",
    navLinks: [
      { title: "Ligue 1", route: Routes.LEAGUE, params: { leagueId: "61" } },
      { title: "Ligue 2", route: Routes.LEAGUE, params: { leagueId: "62" } },
    ],
  },
  {
    icon: porIcon,
    name: "country.portugal",
    navLinks: [
      { title: "Primeira Liga", route: Routes.LEAGUE, params: { leagueId: "94" } },
      { title: "Segunda Liga", route: Routes.LEAGUE, params: { leagueId: "95" } },
    ],
  },
  {
    icon: braIcon,
    name: "country.brazil",
    navLinks: [
      { title: "Serie A", route: Routes.LEAGUE, params: { leagueId: "71" } },
      { title: "Serie B", route: Routes.LEAGUE, params: { leagueId: "72" } },
      { title: "Serie C", route: Routes.LEAGUE, params: { leagueId: "75" } },
      { title: "Serie D", route: Routes.LEAGUE, params: { leagueId: "76" } },
    ],
  },
  {
    icon: usaIcon,
    name: "country.usa",
    navLinks: [
      { title: "Major League Soccer", route: Routes.LEAGUE, params: { leagueId: "253" } },
      { title: "USL Championship", route: Routes.LEAGUE, params: { leagueId: "255" } },
    ],
  },
  {
    icon: mexIcon,
    name: "country.mexico",
    navLinks: [{ title: "Liga MX", route: Routes.LEAGUE, params: { leagueId: "262" } }],
  },
  {
    icon: uruIcon,
    name: "country.uruguay",
    navLinks: [
      { title: "Primera División - Apertura", route: Routes.LEAGUE, params: { leagueId: "268" } },
      { title: "Primera División - Clausura", route: Routes.LEAGUE, params: { leagueId: "270" } },
      { title: "Segunda División", route: Routes.LEAGUE, params: { leagueId: "269" } },
    ],
  },
  {
    icon: parIcon,
    name: "country.paraguay",
    navLinks: [
      { title: "Division Profesional - Apertura", route: Routes.LEAGUE, params: { leagueId: "250" } },
      { title: "Division Profesional - Clausura", route: Routes.LEAGUE, params: { leagueId: "252" } },
      { title: "Division Intermedia", route: Routes.LEAGUE, params: { leagueId: "251" } },
    ],
  },

  {
    icon: colIcon,
    name: "country.colombia",
    navLinks: [
      { title: "Primera A", route: Routes.LEAGUE, params: { leagueId: "239" } },
      { title: "Primera B", route: Routes.LEAGUE, params: { leagueId: "240" } },
    ],
  },
  {
    icon: chiIcon,
    name: "country.chile",
    navLinks: [
      { title: "Primera División", route: Routes.LEAGUE, params: { leagueId: "265" } },
      { title: "Primera B", route: Routes.LEAGUE, params: { leagueId: "266" } },
      { title: "Segunda División", route: Routes.LEAGUE, params: { leagueId: "711" } },
    ],
  },
];
