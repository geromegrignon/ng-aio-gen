const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');
const octokit = github.getOctokit(token);

const main = async () => {
    let startday = new Date();
    // startday.setDate(startday.getDate() - 1);
    startday.setHours(0,0,0,0);

    let endDay = new Date();
    // endDay.setDate(endDay.getDate() - 1);
    endDay.setHours(23,59,59,999);

    const issues = await octokit.rest.repos.getCodeFrequencyStats({
        owner: 'angular',
        repo: 'angular',
        since: startday.toISOString(),
        until: endDay.toISOString(),
        path: 'aio/content'
    });

    console.log(issues.data.length)

    const foo = await octokit.rest.repos.listCommits({
        owner: 'angular',
        repo: 'angular',
        since: startday.toISOString(),
        until: endDay.toISOString(),
        path: 'aio/content'
    });

    foo.data.forEach(async commit => {
        const ff = await octokit.rest.repos.getCommit({
            owner: 'angular',
            repo: 'angular',
            ref: commit.sha
        });
        console.log(ff);

        await octokit.rest.issues.create({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            title: ff.data.commit.message,
            labels: ['triage'],
            body: `
            ## Commit Message\n
            \`\`\`\n
            ${ff.data.commit.message}\n
            \`\`\`\n
            [url](${ff.data.html_url})`
        });
    });



    // console.log(foo)

    /*

    issues.forEach(async (issue) =>  {
        console.log(issue.title);
        const issues = await octokit.rest.issues.create({
            owner: 'angular',
            repo: 'angular',
            since: startday.toISOString(),
            until: endDay.toISOString(),
            path: 'aio/content'
        });
    });

     */


}

main();
