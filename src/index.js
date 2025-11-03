import * as core from "@actions/core";
import * as github from "@actions/github";

try {
  const pid = core.getInput("projectId");
  core.info(`using project ${pid}`)
} catch (error) {
  core.setFailed(error.message);
}