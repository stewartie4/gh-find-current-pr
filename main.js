const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
    const context = github.context;
    const token = core.getInput('github-token', { required: false }) || process.env.GITHUB_TOKEN;
    const state = (core.getInput('state', { required: false }) || 'open').toLowerCase();
    const sha = core.getInput('sha', { required: true });
    const owner = core.getInput('owner', { required: false }) || context.repo.owner;
    const repo = core.getInput('repo', { required: false }) || context.repo.repo;

    const octokit = github.getOctokit(token);
    
    const result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: owner,
        repo: repo,
        commit_sha: sha,
    });

    const prs = result.data.filter((el) => state === 'all' || el.state === state);
    const pr = prs[0];

    core.info(`${owner}/${repo} PR Title: ${(pr && pr.title) || 'NOT FOUND'}`);
    core.info(`${owner}/${repo} PR Number: ${(pr && pr.number) || 'NOT FOUND'}`);
    core.setOutput('title', (pr && pr.title) || '');
    core.setOutput('pr', (pr && pr.number) || '');
    core.setOutput('number', (pr && pr.number) || '');
    core.setOutput('body', (pr && pr.body) || '');
}

main().catch((err) => core.setFailed(err.message));
