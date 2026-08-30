import { useEffect, useState } from 'react';
import { Star, GitFork, ExternalLink, Users, BookOpen } from 'lucide-react';
import { github } from '../data/github';

const USERNAME = github.username;

/* The committed snapshot is the source of truth here.

   This used to call api.github.com on mount and show a spinner while it
   waited. Unauthenticated that is 60 requests an hour per IP: fine for
   one visitor, rate-limited the moment the link is shared, and a network
   round-trip in front of content that was already known at build time.

   So the snapshot renders immediately and a live refresh runs *after*
   paint, purely as an enhancement. If it is rate-limited, offline or
   fails, nothing changes and there is no error state to show — what is
   on screen is real data, just from `npm run snapshot:github` rather
   than from this second. */
const SNAPSHOT = {
  profile: {
    login: github.profile.login,
    name: github.profile.name,
    bio: github.profile.bio,
    avatar_url: github.profile.avatarUrl,
    html_url: github.profile.htmlUrl,
    public_repos: github.profile.publicRepos,
    followers: github.profile.followers,
    following: github.profile.following,
  },
  repos: github.repos.map((r) => ({
    id: r.name,
    name: r.name,
    description: r.description,
    html_url: r.htmlUrl,
    language: r.language,
    stargazers_count: r.stars,
    forks_count: r.forks,
  })),
};

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Java: '#b07219', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
};

export default function GitHubApp() {
  const [state, setState] = useState(SNAPSHOT);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`),
        ]);
        if (!profileRes.ok || !reposRes.ok) return; // keep the snapshot
        const profile = await profileRes.json();
        const repos = await reposRes.json();
        if (!cancelled) setState({ profile, repos });
      } catch {
        // Offline, blocked or rate-limited — the snapshot already shows.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* No loading, error or rate-limited branch any more. There is always
     something real to render, so none of those states can occur — and a
     spinner in front of data the build already had was never honest
     about how much work was actually happening. */
  const { profile, repos } = state;

  return (
    <div className="@container p-6 sm:p-8">
      {/* Profile header */}
      <div className="flex items-start gap-4 mb-8">
        <img
          src={profile.avatar_url}
          alt={profile.login}
          className="w-16 h-16 rounded-2xl"
          style={{ border: '1px solid var(--surface-border)' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{profile.name || profile.login}</h2>
            <a
              href={profile.html_url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              @{profile.login} <ExternalLink size={11} />
            </a>
          </div>
          {profile.bio && <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>{profile.bio}</p>}
          <div className="flex items-center gap-4 mt-3 text-xs font-mono" style={{ color: 'var(--text-4)' }}>
            <span className="flex items-center gap-1"><BookOpen size={12} /> {profile.public_repos} repos</span>
            <span className="flex items-center gap-1"><Users size={12} /> {profile.followers} followers</span>
          </div>
        </div>
      </div>

      {/* Repos */}
      <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-4)' }}>Recent Repositories</h3>
      {repos.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-4)' }}>No public repositories yet.</p>
      ) : (
        <div className="grid @md:grid-cols-2 gap-3">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank" rel="noopener noreferrer"
              className="block p-4 rounded-xl transition-colors hover:border-indigo-500/30"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)' }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{repo.name}</span>
                <ExternalLink size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-4)' }} />
              </div>
              {repo.description && (
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-3)' }}>{repo.description}</p>
              )}
              <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[repo.language] || '#8b8b8b' }} />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1"><Star size={11} /> {repo.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork size={11} /> {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
