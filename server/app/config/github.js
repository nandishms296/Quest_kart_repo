const { Octokit } = require("@octokit/rest");
require("dotenv").config();

function uploadFileToGitHub(fileName, fileContent, message, operationType) {
  const octokit = new Octokit({
    auth: process.env.AUTH,
  });

  if (operationType === 'create') {
    return octokit.repos.createOrUpdateFileContents({
      owner: process.env.OWNER,
      repo: process.env.REPO,
      path: fileName,
      message,
      content: Buffer.from(fileContent).toString('base64'),
      branch: 'main',
    });
  } else if (operationType === 'update') {
    return octokit.repos.getContent({
      owner: process.env.OWNER,
      repo: process.env.REPO,
      path: fileName,
    })
      .then(response => {
        const sha = response.data.sha;
        return octokit.repos.deleteFile({
          owner: process.env.OWNER,
          repo: process.env.REPO,
          path: fileName,
          message: `Deleting ${fileName} before updating it`,
          sha,
          branch: 'main',
        });
      })
      .then(response => {
        const sha = response.data.commit.sha;
        return octokit.repos.createOrUpdateFileContents({
          owner: process.env.OWNER,
          repo: process.env.REPO,
          path: fileName,
          message,
          content: Buffer.from(fileContent).toString('base64'),
          branch: 'main',
          sha,
        });
      })
      .catch(err => console.error(err));
  } else {
    throw new Error('Invalid operation type');
  }
}

module.exports = { uploadFileToGitHub };