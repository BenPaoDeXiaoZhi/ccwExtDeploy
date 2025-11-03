import * as core from "@actions/core";
import * as github from "@actions/github";

try {
  const srcFile = core.getInput("srcFile");
  core.info(`using file ${srcFile}`)
} catch (error) {
  core.setFailed(error.message);
}