import projectsData from "./projects.json";

export const projects = projectsData;

export type Project = (typeof projects)[number];
