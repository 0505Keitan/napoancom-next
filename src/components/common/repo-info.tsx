const repo =
  process.env.NODE_ENV == 'development'
    ? 'Not available on local'
    : `https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}`;
const commit =
  process.env.NODE_ENV == 'development'
    ? ''
    : `${repo}/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`;
const commitMessage = `${
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE ?? 'Not available on local'
}`;

const RepoInfo = () => (
  <details>
    <summary>Repository Info</summary>
    <div>
      <div>
        Repo:{` `}
        <a href={repo} target="_blank" rel="noreferrer">
          {repo}
        </a>
      </div>

      <div>
        Commit:{` `}
        <a href={commit}>{commitMessage}</a>
      </div>
    </div>
  </details>
);

export default RepoInfo;
