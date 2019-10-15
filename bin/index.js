#!/usr/bin/env node

const prompts = require("prompts");
const exec = require("child_process").exec;

exec("git branch", (error, stdout) => {
  if (error) {
    console.error("Current directory is not under git version control")
    return;
  }

  const branches = stdout
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  let currentBranch;
  branches.forEach(branch => {
    if (branch[0] === "*") {
      currentBranch = branch;
    }
  });

  let currentBranchIndex;
  if (currentBranch) {
    currentBranchIndex = branches.indexOf(currentBranch);
    branches[currentBranchIndex] = currentBranch.replace(/^\* /, "");
  }

  const choices = branches.map((title, index) => {
    return {
      title: title,
      value: title,
      selected: index === currentBranchIndex
    };
  });

  (async () => {
    const response = await prompts({
      type: "select",
      name: "value",
      message: "Select branch:",
      choices: choices
    });

    if (response.value) {
      exec(`git checkout ${response.value}`, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(stdout);
      });
    }
  })();
});
